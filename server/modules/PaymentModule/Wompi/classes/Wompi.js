//FOr read the .env enviroment  file 
require('dotenv').config({path:'.env'});
// Use fo make request to servers
const axios = require('axios').default;
// Cryprography Native Node js module
const crypto = require('crypto');
//Mongoose models
const User = require("../../../../models/user");
//Export this cclass in the end of the file
class Wompi {
  //initialize the variables
  constructor(){
    this.CREDIT_CARD = 'CREDIT_CARD_PAYMENT';
    this.NEQUI = 'NEQUI_PAYMENT';
    this.PSE = 'PSE_PAYMENT';
    this.BANCOLOMBIA = 'BANCOLOMBIA_PAYMENT';
    this.NOT_FOUND = 'NOT_FOUND';
    this.request;
    this.creditCardToken = undefined;
    this.nequiToken = undefined;
    //Requiered for make request to buy in api wompi
    this.acceptanceToken = undefined;
    this.permaLink = undefined;
    //type of payment
    this.type = undefined;
    this.idType = undefined;
    this.idNumber = undefined;
    this.institutionCode = undefined;
    this.paymentDescription = undefined;
    this.userType = 0;
    if (process.env.ENVIROMENT=='dev' || process.env.ENVIROMENT == 'local'){
      this.url = process.env.SANDBOX_URL;
      this.wompiKey = process.env.SANDBOX_PUB_KEY;
    } else{
      this.url = process.env.PRODUCTION_URL;
      this.wompiKey = process.env.PRODUCTION_PUB_KEY;
    }
  }
  async createRequest(type, data){
    /*
      This function create the data struct to be sended to WompiAPI
      Check if are PSE or CARD payment and full it with those petition
    */
    //Type of payment PSE \\ BANCOLMBIA \\ PSE
    this.type = type;
    var headers = {'Authorization': 'Bearer '+this.wompiKey};
    // Build the request if the paymmet is for credit card
    if(type==this.CREDIT_CARD){
      User.findOne({phone:data.phoneUser}).then(user=>{
        if(user){
          if(user.cards){
            let cardsArray = user.cards;
            cardsArray.forEach(element => {
              //If the las5numbers are the same and brand too
              if(element.last4Numbers ==data.last4Numbers && element.brand == data.brand){
                //return the codee
                this.creditCardToken = element.wompiCode;
              }
            });
          }
        }
      }).catch(err=>{
        console.log(err);
      })
    } else if(type==this.PSE){
      // BUild the request if the payment is for pse 
      this.idType = data.idType;
      this.idNumber = data.idNumber;
      this.institutionCode = data.institutionCode;
      this.paymentDescription = data.paymentDescription;
      this.userType = data.userType;
    } else if(type==this.BANCOLOMBIA){
      // build the request if the payment is for BANCOLOMBIA
      console.log('Bancolombia Request');
      this.userType = data.userType;
      this.paymentDescription = data.paymentDescription;
    }
    /*
      Generating an authorization token needed for transactions
      and requesting the URL of termns and coditions for use Wompi
    */
    let config = {
      method : 'GET',
      url : this.url+'/merchants/'+this.wompiKey,
    };
    /*  Make the request with axios */
    axios(config).then((response) =>{
      this.acceptanceToken = response.data.data.presigned_acceptance.acceptance_token;
      this.permaLink = response.data.data.presigned_acceptance.permalink;
    }).catch((err) => {
      console.log(err);
    });
  }
  async makeTransaction(value, clientEmail){
    //This function uses the API Keys and create the right request format according
    //The values
    return new Promise((resolve, reject) =>{
      let intervals = [];
      let cont=0;
      let interval = setInterval(() =>{
        let PSE_OR_BANCOLOMBIA = this.type==this.PSE || this.type==this.BANCOLOMBIA;
        if((PSE_OR_BANCOLOMBIA !='NOT_FOUND') && this.getAcceptanceToken()!='NOT_FOUND'){
          cont+=1;
          let paymentMethod = {};
          if(this.type == this.CREDIT_CARD){
            paymentMethod = {
              type : 'CARD',
              token : this.creditCardToken,
              installments : 1
            };
          } else if(this.type==this.PSE){
            paymentMethod = {
              type: "PSE",
              user_type: this.userType, // Tipo de persona, natural (0) o jurídica (1)
              user_legal_id_type: this.idType,//"CC" Tipo de documento, CC o NIT
              user_legal_id: this.idNumber, // Número de documento
              financial_institution_code: this.institutionCode, //"1", // Código (`code`) de la institución financiera
              payment_description: this.paymentDescription
            }
          }
          if(this.type==this.BANCOLOMBIA) {
            console.log("It's bancolombia body");
            paymentMethod = {
              type : "BANCOLOMBIA_TRANSFER",
              user_type : this.userType,
              payment_description : this.paymentDescription,
              sandbox_status : this.sandBoxStatus
            }
          }

          let data = {
            acceptance_token : this.getAcceptanceToken(),
            amount_in_cents : value*100,
            currency : 'COP',
            customer_email : clientEmail,
            payment_method : paymentMethod,
            reference : crypto.randomBytes(32).toString('hex')
          };
          resolve(data);
          clearInterval(intervals[0]);
        } else if(cont>10){
          reject('Timeout');
        }
      }, 500); //This 500 are the miliseconds that has the program to re-check
      //if the authorization token and/or credit card token have been finished
      intervals.push(interval);
    });
  }
  sendTransaction(data){
    //Sends the transaction request to the Wompi API
    //This function must be only called then callback response of makeTransaction
    let headers = { 'Authorization' : 'Bearer '+this.wompiKey }
    let config = {
      method : 'POST',
      url : this.url+'/transactions',
      headers : headers,
      data : data
    }
    return axios(config);
  }
  getStatus(transactionID){
    //This returns the status of the transaction for PSE | BANCOLOMBIA | CARDs
    let headers = { 'Authorization' : 'Bearer '+this.wompiKey }
    let config = {
      method : 'GET',
      url : this.url+'/transactions/'+transactionID
    }
    return axios(config);
  }
  getPSEInstitutions(){
    let headers = { 'Authorization' : 'Bearer '+this.wompiKey }
    let config = {
      method : 'GET',
      url : this.url+'/pse/financial_institutions',
      headers : headers
    }
    return axios(config);
  }
  getAcceptanceToken(){
    //This it's a real function
    return this.acceptanceToken || 'NOT_FOUND';
  }
  async getCreditCardToken(user, last4Numbers,brand){
    if(user){
      if(user.cards){
        let cardsArray = user.cards;
        cardsArray.forEach(element => {
          //If the las5numbers are the same and brand too
          if(element.last4Numbers ==last4Numbers && element.brand == brand){
            //if this cards has wompicode
            if(element.wompiCode){
              //return the codee
              this.creditCardToken = element.wompiCode;
              return this.creditCardToken;
            }
          }
        });
      }else{
        return null;
      }
    }else{
      return null;
    }
    return null;
  }
  async getCreditCardInfo(user, last4Numbers, brand){
    //FInd user with this phone NUmber
      if(user){
        if(user.cards){
          let cardsArray = user.cards;
          console.log(cardsArray);
          cardsArray.forEach(element => {
            //If the las5numbers are the same and brand too
            if(element.last4Numbers ==last4Numbers && element.brand == brand){
              //desencrypt here the data of the number card and return it
              console.log("retornare esta card" + typeof element);
              return true;
            }
          });
        }else{
          return null;
        }
      }else{
        return null;
      };
  }
}
//Export Class to use in pther files
module.exports = Wompi;

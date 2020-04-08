require('dotenv').config({path:'.env'});
const axios = require('axios');
const crypto = require('crypto');

class Wompi {
  constructor(){
    this.CREDIT_CARD = 'CREDIT_CARD_PAYMENT';
    this.NEQUI = 'NEQUI_PAYMENT';
    this.PSE = 'PSE_PAYMENT';
    this.NOT_FOUND = 'NOT_FOUND';
    this.request;
    this.isDevEnv = true;
    this.creditCardToken = undefined;
    this.nequiToken = undefined;
    this.acceptanceToken = undefined;
    this.permaLink = undefined;
    this.type = undefined;
    this.idType = undefined;
    this.idNumber = undefined;
    this.institutionCode = undefined;
    this.paymentDescription = undefined;
    this.userType = 0;
  }

  createRequest(type, data){
    /*
      This function create the data struct to be sended to WompiAPI
      Check if are PSE or CARD payment and full it with those petition
    */
    this.type = type;

    var url = (this.isDevEnv) ? process.env.SANDBOX_URL : process.env.PRODUCTION_URL;
    var pk = (this.isDevEnv) ? process.env.SANDBOX_PUB_KEY : process.env.PRODUCTION_PUB_KEY;
    var headers = {'Authorization': 'Bearer '+pk};

    if(type==this.CREDIT_CARD){
      let creditCard = this.getCreditCardToken(data.card_holder, data.number, 'VISA');
      let buff = data;
      delete buff['value'];
      delete buff['email'];
      if(creditCard==this.NOT_FOUND){
        //Starts the tokenization process
        let config = {
          method : 'POST',
          url : url+'/tokens/cards',
          data : buff,
          headers : headers
        };
        axios(config).then((response)=>{
          this.creditCardToken = response.data.data.id;
        }).catch((err) => {
          console.log(err);
        });
      }
    } else if(type==this.PSE){
      this.idType = data.idType;
      this.idNumber = data.idNumber;
      this.institutionCode = data.institutionCode;
      this.paymentDescription = data.paymentDescription;
      this.userType = data.userType;
    }
    /*
      Generating an authorization token needed for transactions
      and requesting the URL of termns and coditions for use Wompi
    */
    let config = {
      method : 'GET',
      url : url+'/merchants/'+pk,
    };
    axios(config).then((response) =>{
      this.acceptanceToken = response.data.data.presigned_acceptance.acceptance_token;
      this.permaLink = response.data.data.presigned_acceptance.permalink;
    }).catch((err) => {
      console.log(err);
    });
  }

  getCreditCardToken(holder, number, brand){
    //Here goes the Query to find the token of the user, i supose that with that
    //arguments (holder, number(The last four) and the brand of the card it's enough)
    //But you could change that in your considerations
    return  this.creditCardToken || 'NOT_FOUND';
  }
  getAcceptanceToken(){
    //This it's a real function
    return this.acceptanceToken || 'NOT_FOUND';
  }
  async makeTransaction(value, clientEmail){
    //This function uses the API Keys and create the right request format according
    //The values
    return new Promise((resolve, reject) =>{
      let intervals = [];
      let cont=0;
      let interval = setInterval(() =>{
        if((this.type==this.PSE || this.getCreditCardToken('', '', '')!='NOT_FOUND')
            && this.getAcceptanceToken()!='NOT_FOUND'){
          cont+=1;
          let paymentMethod = {};
          if(this.type == this.CREDIT_CARD){
            paymentMethod = {
              type : 'CARD',
              token : this.getCreditCardToken('', '', ''),
              installments : 1
            };
          } else if(this.type==this.PSE){
            console.log('Payment with PSE');
            paymentMethod = {
              type: "PSE",
              user_type: this.userType, // Tipo de persona, natural (0) o jurídica (1)
              user_legal_id_type: this.idType,//"CC" Tipo de documento, CC o NIT
              user_legal_id: this.idNumber, // Número de documento
              financial_institution_code: this.institutionCode, //"1", // Código (`code`) de la institución financiera
              payment_description: this.paymentDescription
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
    var url = (this.isDevEnv) ? process.env.SANDBOX_URL : process.env.PRODUCTION_URL;
    var pk = (this.isDevEnv) ? process.env.SANDBOX_PRIV_KEY : process.env.PRODUCTION_PRIV_KEY;
    let headers = { 'Authorization' : 'Bearer '+pk }
    let config = {
      method : 'POST',
      url : url+'/transactions',
      headers : headers,
      data : data
    }
    return axios(config);
  }
  getStatus(transactionID){
    //This returns the status of the transaction
    var url = (this.isDevEnv) ? process.env.SANDBOX_URL : process.env.PRODUCTION_URL;
    var pk = (this.isDevEnv) ? process.env.SANDBOX_PUB_KEY : process.env.PRODUCTION_PUB_KEY;
    let headers = { 'Authorization' : 'Bearer '+pk }
    let config = {
      method : 'GET',
      url : url+'/transactions/'+transactionID
    }
    return axios(config);
  }
}
module.exports = Wompi;

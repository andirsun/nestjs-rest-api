const express = require('express');
const paymentModule = require('../modules/PaymentModule/paymentModule');
//User mongoose MODEL
const User = require("../models/user");
app = express();

/****************** PAY U Payments *********************** */
app.post("/payment/payU", function(req, res){
  let payInfo = req.body;
  payResult = paymentModule.authAndCapture(payInfo.payerIp, payInfo.payerId,payInfo.buyerId, payInfo.productValue, payInfo.currency, payInfo.paymentMethod,
              payInfo.paymentReference, payInfo.payDescription, res);
});
/********************************************************* */
/***************** NEQUI PAYMENTS ************************ */
app.post("/payment/nequi/newSubscription", function(req, res){
  // Body must be like
  // {
  //   phoneNumber : '3116021602',
  //   name : 'Timugo Barbers',
  //   clientID : '1234567890',
  //   messageID : '123456789'
  //  }
  let body = req.body;
  var phoneNumber = body.phoneNumber;
  var name = body.name || process.env.NEQUI_NAME;
  var messageID = new Date().getTime().toString();

  let document = body.document ;
  // hacer la query aca de guardar el metodo de pago de nequi en el araay
  if(!body.messageID){
    messageID = messageID.substring(messageID.length-9);
  } else{
    messageID = body.messageID;
  }
  var clientID = body.clientID || phoneNumber;

  return paymentModule.nequiNewSubscription(phoneNumber, messageID, clientID, res);
});
app.post('/payment/nequi/getSubscription', function(req, res){
  /* Body must be like
    {
      phoneNumber = '3116021602',
      token : 'token'
    }
  */
  let body = req.body;
  var phoneNumber = body.phoneNumber;
  var token = body.token;
  return paymentModule.nequiGetSubscription(phoneNumber, token, res);
});
app.post('/payment/nequi/automaticPayment', function(req, res){
  /* Body must be like
    {
      phoneNumber : '3116021602', //CLient or barber phone
      messageID : '123456789', // optional
      clientID : '1234567890', // Optional
      token : 'token', // subscription token
      value : '14000' //value of purchase
      references : ['Corte de pelo', 'Corte de baraba 50% off', 'Cejas'] max 3 references
    }
  */
  let body = req.body;
  // subsciption token
  let token = body.token;
  //PHone with the nequi account
  var phoneNumber = body.phoneNequi;
  //Phone User
  let phoneUser = body.phoneUser;
  //Query to search subsciption token for this number
  if(!token){
    User.findOne({phone:phoneUser},function(err,user){
      if (err) {
        return res.status(400).json({
          response: 3,
          content: {
            error: err,
            message: "Error al buscar el cliente"
          }
        });
      }
      if(user){
        if(user.nequiAccounts){
          user.nequiAccounts.forEach((element)=>{
            if(element.phone == phoneNumber){
              token = element.token
            }
          });
        }else{
          return res.status(200).json({
            response: 1,
            content: {
              message: "ese numero de nequi no tiene token"
            }
          });
        }
      }else{
        return res.status(200).json({
          response: 1,
          content: {
            message: "no se encontro a ningun usuario con ese numero"
          }
        });
      }
    });
  }

  var value = body.value;
  var clientID = body.clientID || phoneNumber;
  var references = body.references || ['Cargo sin refencia, Timugo'];
  var messageID = new Date().getTime().toString();
  if(!body.messageID){
    messageID = messageID.substring(messageID.length-9);
  } else{
    messageID = body.messageID;
  }
  ///Its necesary return a promise in nest js
  console.log(phoneNumber, token, value,messageID, clientID, references);
  paymentModule.nequiAutomaticPayment(phoneNumber, token, value,messageID, clientID, references, res);
});
app.post('/payment/nequi/pushPayment', function(req, res) {
  /* Body must be like
    {
      phoneNumber : '3116021602', //phone USER
      messageID : '123456789', //optional,
      value: 14900
      clientID : '1234567890', //optional
      references : ['Corte de pelo', 'Corte de baraba 50% off', 'Cejas'] //max 3 references
    }
  */
  let body = req.body;
  var phoneNumber = body.phoneNumber;
  var value = body.value;
  var messageID = new Date().getTime().toString();
  if(!body.messageID){
    messageID = messageID.substring(messageID.length-9);
  } else{
    messageID = body.messageID;
  }
  var clientID = body.clientID || phoneNumber;
  //example of references <Corte de peloX1,Corte de barabaX3,CejasX0>
  var references = body.references || ['Cargo sin refencia, Timugo'];
  console.log(phoneNumber, value, messageID, clientID, references);
  paymentModule.nequiPushPayment(phoneNumber, value, messageID, clientID, references, res);
});
app.post('/payment/nequi/checkPushPayment', function(req, res){
  /*Body must be like
    {
      codeQR : 'transactionId',
      messageID : 'messageID',
      clientID : 'clientID'
    }
  */
  let body = req.body;
  var codeQR = body.codeQR;
  var messageID = new Date().getTime().toString();
  if (!body.messageID){
    messageID = messageID.substring(messageID.length-9);
  } else{
    messageID = body.messageID;
  }
  var clientID = body.clientID || '3116021602';
  paymentModule.nequiCheckPushPayment(codeQR, messageID, clientID, res);
});
/********************************************************** */
/*************** WOMPI PAYMENTS *************************** */
app.post('/payment/Wompi/transaction', function(req, res){
  //Make payments with PSE | BANCOLOMBIA | CREDIT CARDS
  // Module Required
  const Wompi = require('../modules/PaymentModule/Wompi/classes/Wompi');
  let wompi = new Wompi();
  let body = req.body;
  let data = body.data;
  let type = body.type;
  let bill = body.bill;
  // BUild the request first, then make the transaction
  wompi.createRequest(type, data);
  wompi.makeTransaction(bill.value, bill.email).then((response)=>{
    wompi.sendTransaction(response).then((resp)=>{
      respData = resp.data.data;
      let message = 'DECLINED';
      let description = 'Transacción no creada con exito';
      if(respData.status=='PENDING'){
        message = 'CREATED';
        description = 'Transacción creada exitosamente y esta pendiente para pago';
      }
      let responseBody = {
        response : 2,
        content : {
          message : message,
          description : description,
          details : {
            id : respData.id,
            reference : respData.reference,
            payment_method : respData.payment_method,
            value_in_cents : respData.amount_in_cents
          }
        }
      }
      res.send(responseBody);
    }).catch((err)=>{
      res.send(err);
    });
  });
});
app.post('/payment/Wompi/transactionStatus', function(req, res){
  const Wompi = require('../modules/PaymentModule/Wompi/classes/Wompi');
  let wompi = new Wompi();
  let body = req.body;
  let transactionID = body.transactionID;
  wompi.getStatus(transactionID).then((response) => {
    let respData = response.data.data;
    let description = 'Transacción pendiente.';
    let link = undefined;
    console.log(respData);
    if(respData.status=='APPROVED'){
      description = 'Compra exitosa';
    }else if(respData.status=='DECLINED' || respData.status=='ERROR'){
      if(respData.status=='DECLINED'){
        description = 'Tu transacción ha sido rechazada, intenta de nuevo.';
      } else{
        description = 'Error al procesar la transacción';
      }
    } else if(respData.payment_method_type=='PSE'){
      description = description+' Por favor, dirigete al link de pago en PSE y termina la operación';
      link = respData.payment_method.extra.async_payment_url;
    } else if(respData.payment_method_type=='BANCOLOMBIA_TRANSFER'){
      description = description + 'Por favor, dirigete al link de pago de Bancolombia y realiza la transferencia';
      link = respData.payment_method.extra.async_payment_url;
    }
    let responseBody = {
      response : 2,
      content : {
        message : respData.status,
        description : description,
        link : link
      }
    }
    res.send(responseBody);
    //res.send(responseBody);
  }).catch((err) => {
    let responseBody = {
      response : 3,
      content : {
        message : 'ERROR',
        description : 'Lo sentimos, ha ocurrido un error.'
      }
    }
    res.send(responseBody);
  });
});
app.get('/payment/Wompi/pse/institutions', function(req, res){
  const Wompi = require('../modules/PaymentModule/Wompi/classes/Wompi');
  let wompi = new Wompi();
  wompi.getPSEInstitutions().then((response) => {
    let respData = response.data.data;
    let institutions = []
    respData.forEach((element) =>{
      institutions.push({
        name : element.financial_institution_name,
        code : element.financial_institution_code
      });
    });
    let responseBody = {
      response : 2,
      content : {
        message : "OK",
        response : "Listas de instituciones financieras para PSE"
      },
      institutions : institutions
    }
    res.send(responseBody);
  }).catch((err) => {
    let responseBody = {
      response : 3,
      content : {
        message : "ERROR",
        response : "Lo sentimos, tenemos inconvenientes para realizar pagos con PSE ahora"
      }
    }
    res.send(responseBody);
  });
});
/********************************************************** */

module.exports = app;

const express = require('express');
const paymentModule = require('../modules/PaymentModule/paymentModule');
app = express();



app.get("/payment/payU-test", function(req, res) {
    res.send('Testing nodemon');
});

app.post("/payment/payU", function(req, res){
    let payInfo = req.body;
    payResult = paymentModule.authAndCapture(payInfo.payerIp, payInfo.payerId,
        payInfo.buyerId, payInfo.productValue, payInfo.currency, payInfo.paymentMethod,
        payInfo.paymentReference, payInfo.payDescription, res);
    console.log(req.body);
});

app.post("/payment/nequi/newSubscription", function(req, res){
  //Body must be like
  // {phoneNumber : '3116021602', name : 'Timugo Barbers',
  // clientID = '1234567890', messageID : '123456789'
  // }
  //name, clientID and messageID field could be optional
  let body = req.body;
  var phoneNumber = body.phoneNumber;
  var name = body.name || process.env.NEQUI_NAME;
  var messageID = new Date().getTime().toString();
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
    {phoneNumber = '3116021602', token : 'token' }
  */
  let body = req.body;
  var phoneNumber = body.phoneNumber;
  var token = body.token;
  return paymentModule.nequiGetSubscription(phoneNumber, token, res);
});

app.post('/payment/nequi/automaticPayment', function(req, res){
  /* Body must be like
    {phoneNumber : '3116021602', messageID : '123456789', clientID : '1234567890',
      token : 'token', value : '14000'
      references : ['Corte de pelo', 'Corte de baraba 50% off', 'Cejas']
    }
    messageID, clientID and references (could be 0 but must be at max 3 references)
  */
  let body = req.body;
  var phoneNumber = body.phoneNumber;
  var token = body.token;
  var value = body.value;
  var messageID = new Date().getTime().toString();
  if(!body.messageID){
    messageID = messageID.substring(messageID.length-9);
  } else{
    messageID = body.messageID;
  }
  var clientID = body.clientID || phoneNumber;
  var references = body.references || ['Cargo sin refencia, Timugo'];

  paymentModule.nequiAutomaticPayment(phoneNumber, token, value,
      messageID, clientID, references, res);
});
  app.post('/payment/nequi/pushPayment', function(req, res) {
    /* Body must be like
      {phoneNumber : '3116021602', messageID : '123456789', clientID : '1234567890',
        references : ['Corte de pelo', 'Corte de baraba 50% off', 'Cejas']
      }
      messageID, clientID and references (could be 0 but must be at max 3 references)
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
    var references = body.references || ['Cargo sin refencia, Timugo'];

    paymentModule.nequiPushPayment(phoneNumber, value, messageID, clientID, references, res);
  });
  app.post('./payment/nequi/checkPushPayment', function(req, res){
      /*Body must be like
        {codeQR : 'transactionId', messageID : 'messageID', clientID : 'clientID'}
        messageID and clientID are optional
      */
      let body = req.body;
      var codeQR = body.codeQR;
      var messageID = new Date();
      if (!body.messageID){
        messageID = messageID.substring(messageID.length-9);
      } else{
        messageID = body.messageID;
      }
      var clientID = body.clientID || '3116021602';
      paymentModule.nequiCheckPushPayment(codeQR, messageID, clientID, res);
});
app.post('/payment/Wompi/transaction', function(req, res){
  const Wompi = require('../modules/PaymentModule/Wompi/classes/Wompi');
  let wompi = new Wompi();
  let body = req.body;
  let data = body.data;
  let type = body.type;
  let bill = body.bill;
  console.log(bill);
  wompi.createRequest(type, data);
  wompi.makeTransaction(bill.value, bill.email).then((response)=>{
    wompi.sendTransaction(response).then((resp)=>{
      respData = resp.data.data;
      let message = 'REJECTED';
      let description = 'Transacción no creada con exito';
      if(respData.status=='PENDING'){
        message = 'CREATED';
        description = 'Transacción creada exitosamente';
      }
      let responseBody = {
        response : 2,
        content : {
          message : message,
          description : description
        },
        details : {
          id : respData.id,
          reference : respData.reference,
          payment_method : respData.payment_method,
          value_in_cents : respData.amount_in_cents
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
    if(respData.status=='APPROVED'){
      description = 'Compra exitosa';
    }else if(respData.status=='REJECTED'){
      description = 'Tu transacción ha sido rechazada, intenta de nuevo.';
    } else if(respData.payment_method_type=='PSE'){
      description = description+' Por favor, dirigete al link de pago en PSE y termina la operación';
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


module.exports = app;

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
    messageID = messageId.substring(messageId.length-9);
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

app.post('/payment/nequi/automaticPayment', function(res, req){
  /* Body must be like
    {phoneNumber : '3116021602', messageID : '123456789', clientID : '1234567890',
      token : 'token', value : '14000'
      references : ['Corte de pelo', 'Corte de baraba 50% off']
    }
    messageID, clientID and references (could be 0 but must be at max 3 references)
  */
  let body = req.body;
  var phoneNumber = body.phoneNumber;
  var token = body.token;
  var value = body.value;
  var messageID = new Date().getTime().toString();
  if(!body.messageID){
    messageID = messageId.substring(messageId.length-9);
  } else{
    messageID = body.messageID;
  }
  var clientID = body.clientID || phoneNumber;
  var references = body.references || ['Cargo sin refencia, Timugo'];

  paymentModule.nequiAutomaticPayment(phoneNumber, token, value,
      messageID, clientID, references, res);
});

module.exports = app;

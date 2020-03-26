const signer = require('./Nequi/utils/signer');

const NEQUI_SUBS_HOST = 'api.sandbox.nequi.com';
const NEQUI_SUBS_NEW_PATH = '/subscriptions/v1/-services-subscriptionpaymentservice-newsubscription';
const NEQUI_SUBS_GET_PATH = '/subscriptions/v1/-services-subscriptionpaymentservice-getsubscription';
const NEQUI_SUBS_AUTOMATIC_PAYMENT_PATH = '/subscriptions/v1/-services-subscriptionpaymentservice-automaticpayment';
const payUrl = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';

module.exports = {
    authAndCapture : function(payerIp, payerId, buyerId, productValue, currency, paymentMethod, reference, description, res){
      //A new payU request is created using the builders
      const builder = require('./PayU/paymentBuilder');
      var payUVO = builder.createPayURequest(payerIp, payerId, buyerId, productValue, currency, paymentMethod, reference, description);

      //It's sended using axios and the corresponding on response and on error handler functions
      var axios = require('axios');
      axios.post(payUrl, payUVO)
      .then((res) => {
          res.status(200).json({
              response : 2,
              content : response.data
          });
      }, (error) => {
          return res.status(500).json({
              response : 3,
              content : {
                  error
              }
          });
      });
    },

    nequiNewSubscription : function(phoneNumber, messageID, clientID, res){
      //Create a new nequiNewSubscription request using the builders and adding
      //information that its needed to be signed by aws4
      const builder = require('./Nequi/newSubscriptionBuilder');
      var newSubscription = builder.createNewSubscriptionRequest(phoneNumber,
        messageID, clientID);
      var headers = { 'content-type' : 'application/json' };
      var body = newSubscription.getRequest();

      //Request sended using the aws4 signer for Nequi
      signer.makeSignedRequest(NEQUI_SUBS_HOST, NEQUI_SUBS_NEW_PATH,
        'POST', headers, body,
        (statusCode, resp) => {
          //Do somenthing with the response
          //console.log(JSON.stringify(resp));
        },
        (err) => {
          //Do somenthing with the error response
          //console.log('ERR');
        });
    },
    nequiGetSubscription : function(phoneNumber, token, res){
      //Create a new nequiGetSubscription request using the builders and adding
      //information that its needed to be signed by aws4
      const builder = require('./Nequi/getSubscriptionBuilder');
      var getSubscription = builder.createGetSubscriptionRequest(phoneNumber, token);
      var headers = { 'content-type' : 'application/json' };
      var body = getSubscription.getRequest();

      signer.makeSignedRequest(NEQUI_SUBS_HOST, NEQUI_SUBS_GET_PATH,
        'POST', headers, body,
        (statusCode, resp) => {
          //Do somenthing with the response
          console.log(JSON.stringify(resp));
        },
        (err) => {
          //Do somenthing with the error response
          console.log('ERR');
        });
    },
    nequiAutomaticPayment : function(phoneNumber, token, value, messageID, clientID, references, res){
      //Create a new nequiAutomaticPayment request using the builders and adding
      //information that its needed to be signed by aws4
      const builder = require('./Nequi/automaticPaymentBuilder');
      var automaticPayment = builder.createAutomaticPayment(phoneNumber,
        token, value, messageID, clientID);

      //This is for add references of the buy to Nequi's request
      references.forEach((ref, index, arr) => {
        if(index==1){
          automaticPayment.setReference1(ref);
        } else if(index==2){
          automaticPayment.setReference2(ref);
        } else{
          automaticPayment.setReference3(ref);
        }
      });

      var headers = { 'content-type' : 'application/json' };
      var body = automaticPayment.getRequest();
      console.log(JSON.stringify(body));
      signer.makeSignedRequest(NEQUI_SUBS_HOST, NEQUI_SUBS_AUTOMATIC_PAYMENT_PATH,
        'POST', headers, body,
        (statusCode, resp) => {
          //Do somenthing with the response
          console.log(JSON.stringify(resp));
        },
        (err) => {
          //Do somenthing with the error response
          console.log('ERR\n\n\n', err, '\n\n\nEnd of error');
      });
    }
}

//module.exports.authAndCapture('1', '1', '1', 35000, 'COP', 'VISA', 'Bdañasdasdsxsoa', 'Short description');
//var messageId = new Date().getTime().toString();
//var messageId = messageId.substring(messageId.length-9);
//module.exports.nequiNewSubscription('3162452663', messageId.substring(messageId.length-9), '3117348662', 'res');
//module.exports.nequiAutomaticPayment('3162452663', 'YTQ3NjdkYjMtZGE0ZC03ODNiLTRhYzAtMDEzNjY5OTc5MWJk',
  //'14000', messageId, '3162452663', ['Barba y corte de cabello'] ,'res');

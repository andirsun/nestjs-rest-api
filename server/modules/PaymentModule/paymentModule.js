/******************************** INSTRUCTIONS************ */
/* This files makes all the request to payU and NEQUI servers*/
/* this functions are used by Pay u AND NEQUI endpoints ******/

const signer = require('./Nequi/utils/signer');

const NEQUI_SUBS_HOST = 'api.sandbox.nequi.com';
const NEQUI_SUBS_NEW_PATH = '/subscriptions/v1/-services-subscriptionpaymentservice-newsubscription';
const NEQUI_SUBS_GET_PATH = '/subscriptions/v1/-services-subscriptionpaymentservice-getsubscription';
const NEQUI_SUBS_AUTOMATIC_PAYMENT_PATH = '/subscriptions/v1/-services-subscriptionpaymentservice-automaticpayment';
const NEQUI_PUSH_HOST = 'api.sandbox.nequi.com';
const NEQUI_PUSH_SEND_PATH = '/payments/v1/-services-paymentservice-unregisteredpayment';
const NEQUI_PUSH_CHECK_PAYMENT_PATH='/payments/v1/-services-paymentservice-getstatuspayment';
const NEQUI_PUSH_CANCEL_PAYMENT_PATH='/payments/v1/-services-paymentservice-cancelunregisteredpayment';

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
      signer.makeSignedRequest(NEQUI_SUBS_HOST, NEQUI_SUBS_NEW_PATH,'POST', headers, body,
        (statusCode, resp) => {
          //Do somenthing with the response
          let status="-1";
          let description="";
          let message = "REJECTED";
          var responseCode = 2;
          var token;
          if(resp.ResponseMessage){
            status = resp.ResponseMessage.ResponseHeader.Status.StatusCode;
            description = resp.ResponseMessage.ResponseHeader.Status.StatusDesc;
            if (status == "0"){
              message = "ACCEPTED";
              description = "Subscripción enviada exitosamente, confirmala en Nequi";
              token = resp.ResponseMessage.ResponseBody.any.newSubscriptionRS.token;
            }
          } else{
            message = "NEQUI_ERROR";
            responseCode = 3;
            description = "Un error ha ocurrido, intenta más tarde";
          }

          var response = {
            response : responseCode,
            content : {
              message : message,
              description : description,
              token : token
            }
          }
          //res.status(200).json(response);
          res.status(200).json(response);
        },
        (err) => {
          //Do somenthing with the error response
          var response = {
            response : 1,
            content : {
              message : "ERROR",
              description : "Hemos tenido un inconveniente, ¡Intentalo de nuevo!",
              err
            }
          }
          res.status(200).json(response);
        });
    },
    nequiGetSubscription : function(phoneNumber, token, res){
      //Create a new nequiGetSubscription request using the builders and adding
      //information that its needed to be signed by aws4
      const builder = require('./Nequi/getSubscriptionBuilder');
      var getSubscription = builder.createGetSubscriptionRequest(phoneNumber, token);
      var headers = { 'content-type' : 'application/json' };
      var body = getSubscription.getRequest();

      signer.makeSignedRequest(NEQUI_SUBS_HOST, NEQUI_SUBS_GET_PATH,'POST', headers, body,
        (statusCode, resp) => {
          let status="-1";
          let description="";
          let message = "REJECTED";
          var responseCode = 2;
          if(resp.ResponseMessage){
            status = resp.ResponseMessage.ResponseHeader.Status.StatusCode;
            description = resp.ResponseMessage.ResponseHeader.Status.StatusDesc;
            if (status=="0"){
              message="PENDING";
              description="Subscripción no confirmada";
              status = resp.ResponseMessage.ResponseBody.any.getSubscriptionRS.subscription.status;
              if(status=="1"){
                message="ACCEPTED";
                description="Subscripción activa actualmente";
              }
            }
          } else{
            message = "NEQUI_ERROR";
            responseCode = 3;
            description = "Un error ha ocurrido, intenta más tarde";
          }


          var response = {
            response : responseCode,
            content :{
              message : message,
              description : description
            }
          }
          res.status(200).json(response);
        },
        (err) => {
          //Do somenthing with the error response
          var response = {
            response : 1,
            content : {
              message : "ERROR",
              description : "Hemos tenido un inconveniente, ¡Intentalo de nuevo!",
              err
            }
          }
          res.status(200).json(response);
        });
    },
    nequiAutomaticPayment : function(phoneNumber, token, value, messageID, clientID, references, res){
      //Create a new nequiAutomaticPayment request using the builders and adding
      //information that its needed to be signed by aws4
      const builder = require('./Nequi/automaticPaymentBuilder');
      var automaticPayment = builder.createAutomaticPayment(phoneNumber,
        token, value, messageID, clientID, references);

      var headers = { 'content-type' : 'application/json' };
      var body = automaticPayment.getRequest();
      console.log(JSON.stringify(body));
      signer.makeSignedRequest(NEQUI_SUBS_HOST, NEQUI_SUBS_AUTOMATIC_PAYMENT_PATH,'POST', headers, body,
        (statusCode, resp) => {
          let status="-1";
          let description="";
          let message = "REJECTED";
          var responseCode = 2;
          if(resp.ResponseMessage){
            status = resp.ResponseMessage.ResponseHeader.Status.StatusCode;
            description = resp.ResponseMessage.ResponseHeader.Status.StatusDesc;
            if(status=="0"){
              message="ACCEPTED";
              description="Pago realizado con exito";
            }
          } else{
            message = "NEQUI_ERROR";
            responseCode = 3;
            description = "Un error ha ocurrido, intenta más tarde";
          }
          var response = {
            response : responseCode,
            content : {
              message : message,
              description : description
            }
          }
          res.status(200).json(response);
          //*/console.log(JSON.stringify(resp));
        },
        (err) => {
          //Do somenthing with the error response
          var response = {
            response : 1,
            content : {
              message : "ERROR",
              description : "Hemos tenido un inconveniente, ¡Intentalo de nuevo!",
              err
            }
          }
          res.status(200).json(response);
      });
    },
    nequiPushPayment : function(phoneNumber, value, messageID, clientID, references, res){
      const builder = require('./Nequi/pushPaymentBuilder');
      var pushPayment = builder.createPushPaymentRequest(phoneNumber, value, messageID, clientID, references);

      var headers = { 'content-type' : 'application/json' };
      var body = pushPayment.getRequest();
      console.log(JSON.stringify(body));

      signer.makeSignedRequest(NEQUI_PUSH_HOST, NEQUI_PUSH_SEND_PATH,'POST', headers, body,
        (statusCode, resp) => {
          let status="-1";
          let description="";
          let message = "REJECTED";
          let codeQR = undefined;
          var responseCode = 2;
          if ( resp.ResponseMessage ){
            status = resp.ResponseMessage.ResponseHeader.Status.StatusCode;
            description = resp.ResponseMessage.ResponseHeader.Status.StatusDesc;
            if ( status=="0" ) {
              message="ACCEPTED";
              description="Ya enviamos tu pago, confirmalo en Nequi";
              codeQR = resp.ResponseMessage.ResponseBody.any.unregisteredPaymentRS.transactionId;
            } else if (status=="1") {
              message="APPROVED";
              description="Listo, ¡realizaste tu compra exitosamente!";
            }
          } else {
            message = "NEQUI_ERROR";
            responseCode = 3;
            description = resp.message;
          }
          var response = {
            reponse : responseCode,
            content : {
              message : message,
              description : description,
              codeQR : codeQR
            }
          }
          res.status(200).json(response);
        },
        (err) => {
          //Do somenthing with the error response
          var response = {
            response : 1,
            content : {
              message : "ERROR",
              description : "Hemos tenido un inconveniente, ¡Intentalo de nuevo!",
            }
          }
          res.status(200).json(response);
      });
    },
    nequiCheckPushPayment : function(codeQR, messageID, clientID, res){
      const builder = require('./Nequi/checkPaymentBuilder');
      var checkPayment = builder.createCheckStatusPayment(codeQR, messageID, clientID);

      var headers = { 'content-type' : 'application/json' };
      var body = checkPayment.getRequest();

      signer.makeSignedRequest(NEQUI_PUSH_HOST, NEQUI_PUSH_CHECK_PAYMENT_PATH,
        'POST', headers, body,
        (statusCode, resp) => {
          //Do somenthing with the response
          let status="-1";
          let description="";
          let message = "REJECTED";
          var responseCode = 2;
          if(resp.ResponseMessage){
            status = resp.ResponseMessage.ResponseHeader.Status.StatusCode;
            description = resp.ResponseMessage.ResponseHeader.Status.StatusDesc;
            if(status=="0"){
              message="ACCEPTED";
              description="Por favor, confirma tu pago en Nequi";
            } else if(status=="1"){
              message="APPROVED";
              description="Listo, ¡realizaste tu compra exitosamente!";
            }
          } else{
            message = "NEQUI_ERROR";
            responseCode = 3;
            description = "Un error ha ocurrido, intenta más tarde";
          }
          var response = {
            reponse : responseCode,
            content : {
              message : message,
              description : description
            }
          }
          res.status(200).json(response);
        },
        (err) => {
          //Do somenthing with the error response
          var response = {
            response : 1,
            content : {
              message : "ERROR",
              description : "Hemos tenido un inconveniente, ¡Intentalo de nuevo!",
              err
            }
          }
          res.status(200).json(response);
      });
    }
}
/*
                            RESPONSES DOCUMENTATION
  // response = 1 || 2 || 3; (1=EXT_ERR, 2=ACCEPTED||REJECTD||PENDING, 3=INT_ERR)
  { //Pago con PayU
    response : response,
    content : {
      message : "ACCEPTED", // "REJECTED" // "PENDING"
      description : "Pago exitoso" //"why is rejected" //"Estamos procesando tu pago"
    }
  }
  { //Pago con Debito Automatica (Suscrito) Nequi
    response : response,
    content : {
      message : "ACCEPTED", // "REJECTED"
      description : "Pago exitoso" //"why is rejected" //"Estamos procesando tu pago"
    }
  }

  {//Subscripción Nequi
    reponse : response,
    content : {
      message : "ACCEPTED" || "REJECTED" || "Pending"
      description : "lo que diga Nequi"
  }
  { //Solicitando pago notificación push
    reponse : response,
    content : {
      message : "ACCEPTED" || "REJECTED"
      description : "Notificación enviada",
      codeQR : "transactionId"
  }
  { //Pago con notificiación Push
    reponse : response,
    content : {
      message : "ACCEPTED" || "REJECTED" || "PENDING"
      description : "lo que diga Nequi"
  }
}
*/

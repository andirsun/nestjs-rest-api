/*
  The NequiSendPush Class helps to set all parameters needed
  to create a request to rever a push notification payment
  details of params here : https://docs.conecta.nequi.com.co/?api=unregisteredPayments#!/Reversos/post_services_reverseservices_reversetransaction
*/
class NequiReversePushPayment {
  
  constructor(){
    /* The builder contains the structure to fill before send request */
    const builder = require('./builders/reversePushPaymentBuilder');
    /* Get the structure to fill the properties in the structure */
    this._Request = builder.getBaseRequestMessage();
  }
  /************* SETTERS ************************* */
  /*This function create a time stamp in string format */
  setTimestamp(){
    /* Javascript standart date object */
    var dt = new Date();
    /* Set the timestamp to propertie */
    this._Request.RequestMessage.RequestHeader.RequestDate = dt.toISOString();
  }
  /*This function saves an given timestamp into the request to Nequi Conecta*/
  setRequestDate(dtISOFormat){
    this._Request.RequestMessage.RequestHeader.RequestDate = dtISOFormat;
  }
  /*An unique identifier for log purpose Identificador de la transacción a reversar*/
  setMessageID(messageId){
    this._Request.RequestMessage.RequestHeader.MessageID = messageId;
  }
  /*
    ClientID it's an own purpose identifier, it refers to the terminal
    or node where the transaction it's sended to Nequi Conecta e.g.
    mainServer ID = XXXXXXX
  */
  setClientID(clientID){
    this._Request.RequestMessage.RequestHeader.ClientID = clientID;
  }
  /* Send phone number to request propertie*/
  setPhoneNumber(phoneNumber){
    this._Request.RequestMessage.RequestBody.any.reversionRQ.phoneNumber= phoneNumber;
  }
  /* Send code to request propertie*/
  setCode(code){
    this._Request.RequestMessage.RequestBody.any.reversionRQ.code = code;
  }
  /* 
    Send value (actually is the price) number to request propertie
    for example (14900), value of reverse 
  */
  setValue(value){
    this._Request.RequestMessage.RequestBody.any.reversionRQ.value = value;
  }
  /******************** GETTERS ******************** */
  /* function to get the entire request structure */
  getRequest(){
    return this._Request;
  }
  /* Function to get the request timestamp un the structure */
  getRequestDate(){
    return this._Request.RequestMessage.RequestHeader.RequestDate;
  }
}
/* Export the class */
module.exports = NequiReversePushPayment;
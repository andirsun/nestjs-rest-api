class NequiSendPush {
  constructor(){
    const builder = require('./builders/sendPushBuilder');
    this._Request = builder.getBaseRequestMessage();
  }
  setTimestamp(){
    var dt = new Date();
    this._Request.RequestMessage.RequestHeader.RequestDate = dt.toISOString();
  }
  //This function saves an given timestamp into the request to Nequi Conecta
  setRequestDate(dtISOFormat){
    this._Request.RequestMessage.RequestHeader.RequestDate = dtISOFormat;
  }
  //An unique identifier for log purpose
  setMessageID(messageId){
    this._Request.RequestMessage.RequestHeader.MessageID = messageId;
  }
  //ClientID it's an own purpose identifier, it refers to the terminal or node where
  //the transaction it's sended to Nequi Conecta e.g. mainServer ID = XXXXXXX
  setClientID(clientID){
    this._Request.RequestMessage.RequestHeader.ClientID = clientID;
  }
  setPhoneNumber(phoneNumber){
    this._Request.RequestMessage.RequestBody.any.unregisteredPaymentRQ.phoneNumber = phoneNumber;
  }
  setCode(code){
    this._Request.RequestMessage.RequestBody.any.unregisteredPaymentRQ.code = code;
  }
  setValue(value){
    this._Request.RequestMessage.RequestBody.any.unregisteredPaymentRQ.value = value;
  }
  setReference1(reference){
    this._Request.RequestMessage.RequestBody.any.unregisteredPaymentRQ.reference1 = reference;
  }
  setReference2(reference){
    this._Request.RequestMessage.RequestBody.any.unregisteredPaymentRQ.reference2 = reference;
  }
  setReference3(reference){
    this._Request.RequestMessage.RequestBody.any.unregisteredPaymentRQ.reference3 = reference;
  }
  getRequest(){
    return this._Request;
  }
  getRequestDate(){
    return this._Request.RequestMessage.RequestHeader.RequestDate;
  }
}

module.exports = NequiSendPush;

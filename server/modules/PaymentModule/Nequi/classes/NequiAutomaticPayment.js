class NequiAutomaticPayment{
  constructor(){
    const builder = require('./builders/automaticPaymentBuilder');
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
  //Phone number of the client
  setPhoneNumber(phoneNumber){
    this._Request.RequestMessage.RequestBody.any.automaticPaymentRQ.phoneNumber = phoneNumber;
  }
  //The token created in new-subscription proccess
  setToken(token){
    this._Request.RequestMessage.RequestBody.any.automaticPaymentRQ.token = token;
  }
  //A fielt to do a short description of the transaction e.g. Corte de pelo y barba
  setReference1(reference){
    this._Request.RequestMessage.RequestBody.any.automaticPaymentRQ.reference1 = reference;
  }
  setReference2(reference){
    this._Request.RequestMessage.RequestBody.any.automaticPaymentRQ.reference2 = reference;
  }
  setReference3(reference){
    this._Request.RequestMessage.RequestBody.any.automaticPaymentRQ.reference3 = reference;
  }
  setValue(value){
    this._Request.RequestMessage.RequestBody.any.automaticPaymentRQ.value = value;
  }
  getRequest(){
    return this._Request;
  }
  getRequestDate(){
    return this._Request.RequestMessage.RequestHeader.RequestDate;
  }
}

module.exports = NequiAutomaticPayment;

class NequiNewSubscription{
  constructor(){
    const builder = require('./builders/newSubscriptionBuilder');
    this._Request = builder.getBaseRequestMessage();
  }
  //This functions saves the actual timestamp into the request to Nequi Conecta
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
  //Number of the client
  setPhoneNumber(phoneNumber) {
    this._Request.RequestMessage.RequestBody.any.newSubscriptionRQ.phoneNumber = phoneNumber;
  }
  //Code it's the combination of NIT or CC + Number of Identification that represents
  //Timugo as a bussines in Nequi Conecta
  setCode(code) {
    this._Request.RequestMessage.RequestBody.any.newSubscriptionRQ.code = code;
  }
  //The name of the bussines to be subscripted, e.g. Timugo Barbers
  setName(name){
    this._Request.RequestMessage.RequestBody.any.newSubscriptionRQ.name = name;
  }
  //Return the fulled newSeubscriptionRequest to be used in other instances
  getRequest() {
    return this._Request;
  }
  getRequestDate(){
    return this._Request.RequestMessage.RequestHeader.RequestDate;
  }
}

module.exports = NequiNewSubscription;

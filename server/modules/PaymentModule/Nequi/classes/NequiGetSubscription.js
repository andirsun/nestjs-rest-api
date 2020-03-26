class NequiGetSubscription{
  constructor(){
    const builder = require('./builders/getSubscriptionBuilder');
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
  setPhoneNumber(phoneNumber){
    this._Request.RequestMessage.RequestBody.any.getSubscriptionRQ.phoneNumber = phoneNumber;
  }
  //Combination NIT or CC + Number of Timugo associated account
  setCode(code) {
    this._Request.RequestMessage.RequestBody.any.getSubscriptionRQ.code = code;
  }
  //The token created while proccess of new subscription
  setToken(token){
    this._Request.RequestMessage.RequestBody.any.getSubscriptionRQ.token = token;
  }
  //Return the request
  getRequest(){
    return this._Request;
  }
  getRequestDate(){
    return this._Request.RequestMessage.RequestHeader.RequestDate;
  }
}

module.exports = NequiGetSubscription;

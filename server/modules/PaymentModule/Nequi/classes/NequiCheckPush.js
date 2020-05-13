class NequiCheckPush{
  constructor(){
    const statusPaymentBuilder = require('./builders/statusPaymentBuilder');
    this._Request=statusPaymentBuilder.getBaseRequestMessage();
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
  setCodeQR(code) {
    this._Request.RequestMessage.RequestBody.any.getStatusPaymentRQ.codeQR = code;
  }
  getRequest(){
    return this._Request;
  }
  getRequestDate(){
    return this._Request.RequestMessage.RequestHeader.RequestDate;
  }
}

module.exports = NequiCheckPush;

module.exports = {
  createCheckStatusPayment : function(codeQR, messageID, clientID){
    const NequiCheckPush = require('./classes/NequiCheckPush');
    var nequiCheckPush = new NequiCheckPush();
    nequiCheckPush.setCodeQR(codeQR);
    nequiCheckPush.setMessageID(messageID);
    nequiCheckPush.setClientID(clientID);
    return nequiCheckPush;
  }
}

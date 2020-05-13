module.exports = {
  createPushPaymentRequest : function(phoneNumber, value, messageID, clientID, references){
    const NequiSendPush = require('./classes/NequiSendPush');
    var nequiPushPayment = new NequiSendPush();
    nequiPushPayment.setPhoneNumber(phoneNumber);
    nequiPushPayment.setValue(value);
    nequiPushPayment.setMessageID(messageID);
    nequiPushPayment.setClientID(clientID);
    nequiPushPayment.setCode(process.env.NEQUI_CODE);
    references.forEach((ref, index, arr) => {
      if(index==1){
        nequiPushPayment.setReference1(ref);
      } else if(index==2){
        nequiPushPayment.setReference2(ref);
      } else{
        nequiPushPayment.setReference3(ref);
      }
    });
    return nequiPushPayment;
  }
}

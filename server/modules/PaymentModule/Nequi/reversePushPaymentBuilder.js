/*
  This file create the structure to make a request
  to reverse push payment nequi conecta APi
*/
module.exports = {
  /*
    This function create the structure of endpoint to
    reverse a push notification payment
  */
  reversePushPaymentRequest : function(phoneNumber,value,messageID,clientID){
    const NequiReversePush = require('./classes/NequiReversePush');
    var nequiReversePushPayment = new NequiReversePush();
    /* Set the class properties */
    nequiReversePushPayment.setPhoneNumber(phoneNumber);
    nequiReversePushPayment.setValue(value);
    nequiReversePushPayment.setMessageID(messageID);
    nequiReversePushPayment.setClientID(clientID);
    /* Code must to be provide in the .env file */
    nequiReversePushPayment.setCode(process.env.NEQUI_CODE);
    return nequiReversePushPayment;
    
  }
}

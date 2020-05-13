require('dotenv').config({path:'.env'});

module.exports = {
  createAutomaticPayment : function(phoneNumber, token, value, messageID, clientID, references){
    const NequiAutomaticPayment = require('./classes/NequiAutomaticPayment');
    var nequiAutomaticPayment = new NequiAutomaticPayment();

    nequiAutomaticPayment.setPhoneNumber(phoneNumber);
    nequiAutomaticPayment.setToken(token);
    nequiAutomaticPayment.setValue(value);
    nequiAutomaticPayment.setMessageID(messageID);
    nequiAutomaticPayment.setClientID(clientID);

    references.forEach((ref, index, arr) => {
      if(index==1){
        nequiAutomaticPayment.setReference1(ref);
      } else if(index==2){
        nequiAutomaticPayment.setReference2(ref);
      } else{
        nequiAutomaticPayment.setReference3(ref);
      }
    });
    return nequiAutomaticPayment;
  }
};

//console.log(JSON.stringify(module.exports.createAutomaticPayment('3117348662', 'token', '20000', '123', '123')));

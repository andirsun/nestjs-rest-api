require('dotenv').config({path:'.env'});

module.exports = {
  createAutomaticPayment : function(phoneNumber, token, value, messageID, clientID){
    const NequiAutomaticPayment = require('./classes/NequiAutomaticPayment');
    var nequiAutomaticPayment = new NequiAutomaticPayment();

    nequiAutomaticPayment.setPhoneNumber(phoneNumber);
    nequiAutomaticPayment.setToken(token);
    nequiAutomaticPayment.setValue(value);
    nequiAutomaticPayment.setMessageID(messageID);
    nequiAutomaticPayment.setClientID(clientID);
    return nequiAutomaticPayment;
  }
};

//console.log(JSON.stringify(module.exports.createAutomaticPayment('3117348662', 'token', '20000', '123', '123')));

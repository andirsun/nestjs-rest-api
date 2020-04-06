require('dotenv').config({path:'.env'});

module.exports = {
  createNewSubscriptionRequest : function(phoneNumber, messageID, clientID){
    const NewSubscription = require('./classes/NequiNewSubscription');
    var newSubscription = new NewSubscription();
    newSubscription.setCode('NIT_1' || process.env.NEQUI_CODE);
    newSubscription.setName('Timugo' || process.env.NEQUI_NAME);
    newSubscription.setMessageID(messageID);
    newSubscription.setClientID(clientID);
    newSubscription.setPhoneNumber(phoneNumber);
    return newSubscription;
  }
}

module.exports.createNewSubscriptionRequest('3116021602', '123', '-1');

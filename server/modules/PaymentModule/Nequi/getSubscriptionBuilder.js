require('dotenv').config({path:'.env'});

module.exports = {
  createGetSubscriptionRequest : function(phoneNumber, token){
    const NequiGetSubscription = require('./classes/NequiGetSubscription');
    var nequiGetSubscription = new NequiGetSubscription();
    nequiGetSubscription.setPhoneNumber(phoneNumber);
    nequiGetSubscription.setToken(token);
    nequiGetSubscription.setCode(process.env.NEQUI_CODE || 'NIT_2');
    return nequiGetSubscription;
  }
};

//console.log(JSON.stringify(module.exports.createGetSubscriptionRequest('3117348660', 'token')));

module.exports = {
    authAndCapture : function(payerIp, payerId, buyerId, productValue, currency, paymentMethod, reference, description, res){
        const payUrl = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';
        
        const builder = require('./PayU/paymentBuilder');
        var payUVO = builder.createPayURequest(payerIp, payerId, buyerId, productValue, currency, paymentMethod, reference, description);
        console.log(payUVO);
        var axios = require('axios');
        axios.post(payUrl, payUVO)
        .then((response) => {
            res.status(200);
            res.send(JSON.stringify(response.data).toString());
        }, (error) => {
            res.status(500);
            res.send('Error while executing transaction');
        });
        //*/
    }
}

//module.exports.authAndCapture('1', '1', '1', 35000, 'COP', 'VISA', 'Bdañasdasdsxsoa', 'Short description');
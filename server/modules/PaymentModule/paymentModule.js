module.exports = {
    authAndCapture : function(payerIp, payerId, buyerId, productValue, currency, paymentMethod, reference, description, res){
        const payUrl = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';
        
        const builder = require('./PayU/paymentBuilder');
        var payUVO = builder.createPayURequest(payerIp, payerId, buyerId, productValue, currency, paymentMethod, reference, description);
        console.log(payUVO);
        var axios = require('axios');
        axios.post(payUrl, payUVO)
        .then((response) => {
            return res.status(200).json({
                response : 2,
                content : {
                    response
                }
            }
            );
        }, (error) => {
            return res.status(500).json({
                response : 3,
                content : {
                    error
                }
            });
        });
        //*/
    }
}

//module.exports.authAndCapture('1', '1', '1', 35000, 'COP', 'VISA', 'Bdañasdasdsxsoa', 'Short description');
const express = require('express');
const PaymentModule = require('../modules/PaymentModule/paymentModule');
app = express();

app.get("/payment/payU-test", function(req, res) {
    res.send('Testing nodemon');
});

app.post("/payment/payU", function(req, res){
    let payInfo = req.body;
    payResult = PaymentModule.authAndCapture(payInfo.payerIp, payInfo.payerId,
        payInfo.buyerId, payInfo.productValue, payInfo.currency, payInfo.paymentMethod,
        payInfo.paymentReference, payInfo.payDescription, res);
    console.log(req.body);
    //payResult);
});

module.exports = app;
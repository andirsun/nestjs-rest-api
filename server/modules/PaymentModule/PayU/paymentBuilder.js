module.exports = {
    createPayURequest : function(payerIp, payerId, buyerId, productValue, currency, paymentMethod, reference, description){
        //ALl of this file need to capture the creditCard info byUisng payerId and buyerId

        const PayUVO = require('./classes/payUVO');
        const payUVO = new PayUVO();
	    var merchantInfo = this.getMerchantInfo();
        payUVO.setMerchantInfo(merchantInfo.apiKey, merchantInfo.apiLogin);
        payUVO.setAccountId(this.getAccountId());
        var deviceSessionId = this.genDeviceSessionId(payerIp, payerId, productValue);
        payUVO.setDeviceSessionId(deviceSessionId);
        payUVO.setOrderInfo(reference, description);
        var orderAddress = this.getOrderAddress(buyerId);
        payUVO.setOrderAddress(orderAddress.street1, orderAddress.street2,
            orderAddress.city, orderAddress.state, orderAddress.country,
            orderAddress.postalCode, orderAddress.phone);
        payUVO.setOrderValue(productValue, currency);
        var buyer = this.getBuyerInfo(buyerId);
        payUVO.setBuyerInfo(buyer.merchantBuyerId, buyer.fullName,
            buyer.emailAddress, buyer.contactPhone, buyer.dniNumber);
        var buyerAddress = this.getBuyerAddress(buyerId);
        payUVO.setBuyerAddress(buyerAddress.street1, buyerAddress.street2, buyerAddress.city,
            buyerAddress.state, buyerAddress.country, buyerAddress.postalCode, buyerAddress.phone);
        var payer = this.getPayerInfo(payerId);
        payUVO.setPayerInfo(payer.merchantPayerId, payer.fullName,
            payer.emailAddress, payer.contactPhone, payer.dniNumber);
        var payerAddress = this.getPayerAddress(payerIp);
        payUVO.setPayerAddress(payerAddress.street1, payerAddress.street2, payerAddress.city,
            payerAddress.state, payerAddress.country, payerAddress.postalCode, payerAddress.phone);
        var creditCard = this.getCreditCard(buyerId);
        payUVO.setCreditCardInfo(creditCard.number, creditCard.securityCode,
            creditCard.expirationDate, creditCard.name);
        payUVO.setTransactionInfo('AUTHORIZATION_AND_CAPTURE', paymentMethod, 'CO', payerIp, 'null', 'null');
        return payUVO.paymentRequest;
    },
    //Use this functions to full well the json form to send to payU system
    getMerchantInfo : function() {
	const paymentUtils = require('./utils/paymentUtils');
	const utils = new paymentUtils();
	var merchantInfo = {
	    apiKey : utils.apiKey(),
	    apiLogin : utils.apiLogin()
	}
	return merchantInfo;
    },
    getAccountId : function() {
	const paymentUtils = require('./utils/paymentUtils');
	const utils = new paymentUtils();
	return utils.accountId();
    },
    genDeviceSessionId : function(ip, id, tx){
        const paymentUtils=require('./utils/paymentUtils');
        const utils = new paymentUtils();
        return utils.generateDeviceSessionId(ip, id, tx);
    },
    getOrderAddress : function(userId){
        var address = {
            street1 : 'generic street1',
            street2 : 'generic street2',
            city : 'Generic City',
            state: 'Generic State',
            country : 'CO',
            postalCode : '000000',
            phone : '3117598356'
        }
        return address;
    },
    getBuyerInfo : function (buyerId){
        var buyer = {
            merchantBuyerId : buyerId, //Buyer's identifier on ecommerce system
            fullName : 'Firstname Lastname', //Buyer's Fullname
            emailAddress : 'email@server.com', //Buyer's email address
            contactPhone : '123456', //Buyer's contact phone
            dniNumber : '1111111111', //Buyer's dniNumber
        }
        return buyer;
    },
    getBuyerAddress : function(buyerId){
        var address = {
            street1 : 'generic street1',
            street2 : 'generic street2',
            city : 'generic City',
            state: 'generic State',
            country : 'CO',
            postalCode : '000000',
            phone : '3117598356'
        }
        return address;
    },
    getPayerInfo : function(payerId){
        var payer = {
            merchantPayerId : payerId, //Payer's Identifier on ecommer system
            fullName : 'PFirstname Lastname', //Payer's fullname
            emailAddress : 'payer@server.com', //Payer's email address
            contactPhone : '31175983265', //Payer's contact phone
            dniNumber : '2222222222', // DNI Number of the buyer
        }
        return payer;
    },
    getPayerAddress : function(payerId){
        var address = {
            street1 : 'generic street1',
            street2 : 'generic street2',
            city : 'Generic City',
            state: 'Generic State',
            country : 'CO',
            postalCode : '000000',
            phone : '3117598356'
        }
        return address;
    },
    getCreditCard : function(buyerId){
        var creditCard = {
            number : '4896350050851805', //Number of the creditcard
            securityCode : '627', //Number of security code
            expirationDate : '2024/08', //Expiration Data of the creditcard [YYYY/MM] format
            name : 'APPROVED'
        }
        return creditCard;
    }
}
module.exports.createPayURequest();

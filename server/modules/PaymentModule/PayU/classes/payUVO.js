class PayUVO{
  constructor(){
    const builder = require('./builders/paymentUVOBuilder');
    this._PaymentRequest=builder.getBasePayUVO();
  }

  get orderId(){
    return this._PaymentRequest.transaction.order.accountId;
  }

  get buyerId(){
    return this._PaymentRequest.transaction.order.buyer.merchantBuyerId;
  }

  get payerId(){
    return this._PaymentRequest.transaction.payer.merchantPayerId;
  }
  get payerIp(){
    return this._PaymentRequest.transaction.ipAddress;
  }

  setMerchantInfo(apiKey, apiLogin){
    this._PaymentRequest.merchant.apiKey=apiKey;
    this._PaymentRequest.merchant.apiLogin=apiLogin;
  }

  setSignature(signature){
    this._PaymentRequest.transaction.order.signature=signature;
  }

  setAccountId(accountId){
    this._PaymentRequest.transaction.order.accountId=accountId;
  }

  setOrderInfo(referenceCode, description){
    /*referenceCode = a code reference TestPayU as default
      description = description of the order
      signature = signature sent before at beggining of the payment process */
    this._PaymentRequest.transaction.order.referenceCode=referenceCode;
    this._PaymentRequest.transaction.order.description=description;
  }

  setOrderValue(tx_value, currency){
    var tx_tax = Math.floor(tx_value*0.19);
    var tx_tax_return_base = tx_value-tx_tax;
    this._PaymentRequest.transaction.order.additionalValues.TX_VALUE.value=tx_value;
    this._PaymentRequest.transaction.order.additionalValues.TX_VALUE.currency=currency;
    this._PaymentRequest.transaction.order.additionalValues.TX_TAX.value=tx_tax;
    this._PaymentRequest.transaction.order.additionalValues.TX_TAX.currency=currency;
    this._PaymentRequest.transaction.order.additionalValues.TX_TAX_RETURN_BASE.value=tx_tax_return_base;
    this._PaymentRequest.transaction.order.additionalValues.TX_TAX_RETURN_BASE.currency=currency;
  }

  setBuyerInfo(merchantBuyerId, name, email, phone, dni){
    this._PaymentRequest.transaction.order.buyer.merchantBuyerId=merchantBuyerId;
    this._PaymentRequest.transaction.order.buyer.fullName=name;
    this._PaymentRequest.transaction.order.buyer.emailAddress=email;
    this._PaymentRequest.transaction.order.buyer.contactPhone=phone;
    this._PaymentRequest.transaction.order.buyer.dniNumber=dni;
  }
  setShippingAddress(street1, street2, city, state, country, postalCode, phone){
    this._PaymentRequest.transaction.order.shippingAddress.street1=street1;
    this._PaymentRequest.transaction.order.shippingAddress.street2=street2;
    this._PaymentRequest.transaction.order.shippingAddress.city=city;
    this._PaymentRequest.transaction.order.shippingAddress.state=state;
    this._PaymentRequest.transaction.order.shippingAddress.country=country;
    this._PaymentRequest.transaction.order.shippingAddress.postalCode=postalCode;
    this._PaymentRequest.transaction.order.shippingAddress.phone=phone;
  }

  setPayerInfo(merchantPayerId, name, email, phone, dni){
    this._PaymentRequest.transaction.payer.merchantPayerId=merchantPayerId;
    this._PaymentRequest.transaction.payer.fullName=name;
    this._PaymentRequest.transaction.payer.emailAddress=email;
    this._PaymentRequest.transaction.payer.contactPhone=phone;
    this._PaymentRequest.transaction.payer.dniNumber=dni;
  }
  setCreditCardInfo(number, cvv, expiration, name){
    this._PaymentRequest.transaction.creditCard.number=number;
    this._PaymentRequest.transaction.creditCard.securityCode=cvv;
    this._PaymentRequest.transaction.creditCard.expirationDate=expiration;
    this._PaymentRequest.transaction.creditCard.name=name;
  }

  setTransactionInfo(type, paymentMethod, paymentCountry, ipAddress, cookie, userAgent){
    this._PaymentRequest.transaction.type=type;
    this._PaymentRequest.transaction.paymentMethod=paymentMethod;
    this._PaymentRequest.transaction.paymentCountry=paymentCountry;
    this._PaymentRequest.transaction.ipAddress=ipAddress;
    this._PaymentRequest.transaction.cookie=cookie;
    this._PaymentRequest.transaction.userAgent=userAgent;
  }

  setDeviceSessionId(deviceSessionId){
    this._PaymentRequest.transaction.deviceSessionId=deviceSessionId;
  }

  setBuyerAddress(street1, street2, city, state, country, postalCode, phone){
    this._PaymentRequest.transaction.order.buyer.shippingAddress.street1=street1;
    this._PaymentRequest.transaction.order.buyer.shippingAddress.street2=street2;
    this._PaymentRequest.transaction.order.buyer.shippingAddress.city=city;
    this._PaymentRequest.transaction.order.buyer.shippingAddress.state=state;
    this._PaymentRequest.transaction.order.buyer.shippingAddress.country=country;
    this._PaymentRequest.transaction.order.buyer.shippingAddress.postalCode=postalCode;
    this._PaymentRequest.transaction.order.buyer.shippingAddress.phone=phone;
  }
  setPayerAddress(street1, street2, city, state, country, postalCode, phone){
    this._PaymentRequest.transaction.payer.billingAddress.street1=street1;
    this._PaymentRequest.transaction.payer.billingAddress.street2=street2;
    this._PaymentRequest.transaction.payer.billingAddress.city=city;
    this._PaymentRequest.transaction.payer.billingAddress.state=state;
    this._PaymentRequest.transaction.payer.billingAddress.country=country;
    this._PaymentRequest.transaction.payer.billingAddress.postalCode=postalCode;
    this._PaymentRequest.transaction.payer.billingAddress.phone=phone;
  }
  setOrderAddress(street1, street2, city, state, country, postalCode, phone){
    this._PaymentRequest.transaction.order.shippingAddress.street1=street1;
    this._PaymentRequest.transaction.order.shippingAddress.street2=street2;
    this._PaymentRequest.transaction.order.shippingAddress.city=city;
    this._PaymentRequest.transaction.order.shippingAddress.state=state;
    this._PaymentRequest.transaction.order.shippingAddress.country=country;
    this._PaymentRequest.transaction.order.shippingAddress.postalCode=postalCode;
    this._PaymentRequest.transaction.order.shippingAddress.phone=phone;
  }

  get paymentRequest(){
    return this._PaymentRequest;
  }
}

module.exports=PayUVO

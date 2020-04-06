class PaymentUtils{
  constructor(){
    this._credentials = this.loadEnvironment();
  }

  apiKey(){
    return this._credentials.API_KEY;
  }

  apiLogin(){
    return this._credentials.API_LOGIN;
  }

  merchantId(){
    return this._credentials.MERCHANT_ID;
  }

  accountId(){
    return this._credentials.ACCOUNT_ID;
  }

  getSignature(referenceCode, tx_value, currency){
    return this.generateSignature(this.apiKey(), this.merchantId(), referenceCode, tx_value, currency);
  }

  getDeviceSessionId(ipPayer, idPayer, idProduct){
    return this.generateDeviceSessionId(ipPayer, idPayer, idProduct);
  }

  loadEnvironment(){
    var credentials = {}
    const fs = require('fs');
    let text = fs.readFileSync('./server/modules/PaymentModule/PayU/utils/credentials', 'utf8');
    let lines=text.split('\n');
    for(let i=0; i<lines.length-1; i++){
      let tmp = lines[i].split("=");
      credentials[tmp[0]]=tmp[1];
    }
    return credentials;
  }

  generateSignature(apiKey, merchantId, referenceCode, tx_value, currency){
    const crypto = require('crypto');
    let signatureString = apiKey+"~"+merchantId+"~"+referenceCode+"~"+tx_value.toString()+"~"+currency;
    var signature = crypto.createHash('md5').update(signatureString).digest("hex");
    return signature;
  }

  generateDeviceSessionId(ipPayer, idPayer, idProduct){
    const crypto = require('crypto');
    let timestamp = process.hrtime();
    let deviceSessionIdString = ipPayer+"~"+idPayer+"~"+idProduct+timestamp[0].toString()+timestamp[1].toString();
    var deviceSessionId = crypto.createHash('md5').update(deviceSessionIdString).digest("hex");
    deviceSessionId = deviceSessionId+idPayer;
    return deviceSessionId;
  }
}

module.exports = PaymentUtils

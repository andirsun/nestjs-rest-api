module.exports = {
    getBaseMerchant : function (){
        var merchant = {
          apiKey : '', //Field sumministred for PayU
          apiLogin : '', // Field sumministred for PayU
        }
        return merchant;
      },
      
      getBaseTransaction : function(){
        var transaction = {
          order : module.exports.getBaseOrder(), //Information of the order
          payer : module.exports.getBasePayer(), //Information of the payer
          creditCard : module.exports.getBaseCreditCard(), //Information of CreditCard
          extraParameters : module.exports.getBaseExtraParameters(), //Information of Extraparameters
          type : 'AUTHORIZATION_AND_CAPTURE',  //AUTHORIZATION_AND_CAPTURE or AUTHORIZATION or CAPTURE
          paymentMethod : '', //Payment methods e.g. VISA, MASTERCARD, DINNERSCLUB, ...
          paymentCountry : 'CO',
          deviceSessionId : '',
          ipAddress : '', // Ip direction where the buyer is
          cookie : '', //Cookie stored on the device where the buyer is online
          userAgent : '' //Browser where the buyer is connected
        }
        return transaction;
      },
      
      getBaseOrder : function(){
        var order = {
          accountId : '', //Account Identifier if exists
          referenceCode : '', //Reference code of the order, identifier of the transaction in ecommerce system
          description : '', //Description of the order
          language : 'es', //Language used on the emails sended to seller and buyer
          signature : '', //that's generated with generateSignature on paymentFunctions
          notifyUrl : 'http://www.tes.com/confirmation', //URL for notification or confirmation of the order
          additionalValues : module.exports.getBaseAdditionalValues(), 
          buyer : module.exports.getBaseBuyer(),
          shippingAddress : module.exports.getBaseAddress()
        }
        return order;
      },
      
      getBaseAdditionalValues : function(){
          var additionalValues = {
            TX_VALUE : module.exports.getBaseTxValue(),
            TX_TAX : module.exports.getBaseTX_TAX(),
            TX_TAX_RETURN_BASE : module.exports.getBaseTX_RETURN_BASE()
          }
          return additionalValues;
      },
      
      getBaseTxValue : function() {
        var txValue = {
          value : 0,
          currency : 'COP'
        }
        return txValue;
      },
      
      getBaseTX_TAX : function(){
        var txTax = {
          value : 0,
          currency : 'COP'
        }
        return txTax;
      }, 

      getBaseTX_RETURN_BASE : function(){
        var txReturnBase = {
          value : 0,
          currency : 'COP'
        }
        return txReturnBase;
      },
      
      getBaseBuyer : function(){
        var buyer = {
          merchantBuyerId : '', //Buyer's identifier on ecommerce system
          fullName : '', //Buyer's Fullname 
          emailAddress : '', //Buyer's email address
          contactPhone : '', //Buyer's contact phone
          dniNumber : '', //Buyer's dniNumber
          shippingAddress : module.exports.getBaseAddress()
        }
        return buyer;
      },

      getBasePayer : function(){
        var payer = {
          merchantPayerId : '', //Payer's Identifier on ecommer system
          fullName : '', //Payer's fullname
          emailAddress : '', //Payer's email address
          contactPhone : '', //Payer's contact phone
          dniNumber : '', // DNI Number of the buyer
          billingAddress : module.exports.getBaseAddress()
        }
        return payer;
      },

      getBaseCreditCard: function(){
        var creditCard = {
          number : '', //Number of the creditcard
          securityCode : '', //Number of security code
          expirationDate : '', //Expiration Data of the creditcard [YYYY/MM] format
          name : '' //We don't support transactions without CVV
        }
        return creditCard;
      },

      getBaseExtraParameters : function(){
        var extraParameters = {
          INSTALLMENTS_NUMBER: 1 //The value for Colombia
        }
        return extraParameters;
      },
      getBaseAddress : function(){
        var address = {
          street1 : '', 
          street2 : '', 
          city : '',
          state: '',
          country : '',
          postalCode : '',
          phone : ''
        }
        return address;
      },

      getBasePayUVO :function(){
        var payUVO = {
          language : 'es', //Language used in the app, often use just for the response string languages
          command : 'SUBMIT_TRANSACTION', // Use always SUBMIT_TRANSACTION
          merchant : module.exports.getBaseMerchant(),
          transaction : module.exports.getBaseTransaction(),
          test : true
        }
        return payUVO;
      }
}
module.exports = {
  getBaseRequestMessage : function(){
    var requestMessage = {
      RequestMessage : {
        RequestHeader : this.getBaseRequestHeader(),
        RequestBody : this.getBaseRequestBody()
      }
    };
    return requestMessage;
  },
  getBaseRequestHeader : function (){
    var dt = new Date();
    var requestHeader = {
      Channel: "PDA05-C001",
      RequestDate: dt.toISOString(),//"2017-06-21T20:26:12.654Z",
      MessageID: "1234567890", //Some unique value to log purposes
      ClientID: "12345", //The ID of the devide where the transaction is requested e.g MAIN_SERVER_ID =XXXXXXXX
      Destination : this.getBaseDestination()
    };
    return requestHeader;
  },
  getBaseRequestBody : function(){
    var requestBody = {
      any : {
        getSubscriptionRQ : {
          phoneNumber: "3998764643", // Client's number
          code: "NIT_1", //Combination of NIT or CC + Number of identification of Timugo accound
          token: "YmFzZSA2NCB0b2tlbiB0ZXN0" //a Token given when the subscription it's created
        }
      }
    };
    return requestBody;
  },
  getBaseDestination : function(){
    var destination = {
      ServiceName: "SubscriptionPaymentService",
      ServiceOperation: "getubscription",
      ServiceRegion: "C001",
      ServiceVersion: "1.0.0"
    };
    return destination;
  }
};

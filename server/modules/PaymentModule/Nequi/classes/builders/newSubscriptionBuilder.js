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
      MessageID: "1234567890",
      ClientID: "12345",
      Destination : this.getBaseDestination()
    };
    return requestHeader;
  },
  getBaseRequestBody : function(){
    var requestBody = {
      any : {
        newSubscriptionRQ : {
          phoneNumber: "3998764643",
          code: "NIT_1",
          name: "Timugo Barbers"
        }
      }
    };
    return requestBody;
  },
  getBaseDestination : function(){
    var destination = {
      ServiceName: "SubscriptionPaymentService",
      ServiceOperation: "newSubscription",
      ServiceRegion: "C001",
      ServiceVersion: "1.0.0"
    };
    return destination;
  }
};

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
  getBaseRequestHeader : function(){
    var dt = new Date();
    var requestHeader = {
      Channel: "PNP04-C001",
      RequestDate: dt.toISOString(),
      MessageID: "1234567890",
      ClientID: "12345",
      Destination : this.getBaseDestination()
    };
    return requestHeader;
  },
  getBaseRequestBody : function() {
    var requestBody = {
      any : {
        unregisteredPaymentRQ : {
          phoneNumber: "3998764643",
          code: "NIT_1",
          value: "1000",
          reference1: "reference1"
        }
      }
    }
    return requestBody;
  },
  getBaseDestination : function() {
    var destination = {
      ServiceName: "PaymentsService",
      ServiceOperation: "unregisteredPayment",
      ServiceRegion: "C001",
      ServiceVersion: "1.0.0"
    }
    return destination;
  }
}

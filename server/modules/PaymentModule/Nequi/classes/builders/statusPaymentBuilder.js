module.exports = {
  getBaseRequestMessage : function(){
    var requestMessage = {
      RequestMessage: {
        RequestHeader : this.getBaseRequestHeader(),
        RequestBody : this.getBaseRequestBody()
      }
    };
    return requestMessage;
  },
  getBaseRequestHeader : function(){
    var date = new Date();
    var requestHeader = {
      Channel: "PNP04-C001",
      RequestDate: date.toISOString(),
      MessageID: "1234567890",
      ClientID: "12345",
      Destination : this.getBaseDestination()
    };
    return requestHeader;
  },
  getBaseRequestBody : function(){
    var requestBody = {
      any: {
        getStatusPaymentRQ: {
          codeQR : '350-913291938-2471-C001'
        }
      }
    };
    return requestBody;
  },
  getBaseDestination : function(){
    var destination = {
      ServiceName: "PaymentsService",
      ServiceOperation: "getStatusPayment",
      ServiceRegion: "C001",
      ServiceVersion: "1.0.0"
    };
    return destination;
  }
}

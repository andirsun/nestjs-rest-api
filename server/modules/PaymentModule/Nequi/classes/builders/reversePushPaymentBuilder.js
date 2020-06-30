/* Builder of body request */
/* 
  Example of body tu return
  {
  "RequestMessage": {
    "RequestHeader": {
      "Channel": "PNP04-C001",
      "RequestDate": "2017-06-21T20:26:12.654Z",
      "MessageID": "1234567890",
      "ClientID": "12345",
      "Destination": {
        "ServiceName": "ReverseServices",
        "ServiceOperation": "reverseTransaction",
        "ServiceRegion": "C001",
        "ServiceVersion": "1.0.0"
      }
    },
    "RequestBody": {
      "any": {
        "reversionRQ": {
          "phoneNumber": "3998764643",
          "value": "0",
          "code": "NIT_1",
          "messageId": "9857836163",
          "type": "payment"
        }
      }
    }
  }
}
*/
module.exports = {
  /*
    THis function return the entire body of request 
  */
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
  getBaseDestination : function() {
    var destination = {
      ServiceName: "ReverseServices",
      ServiceOperation: "reverseTransaction",
      ServiceRegion: "C001",
      ServiceVersion: "1.0.0"
    }
    return destination;
  },
  getBaseRequestBody : function() {
    var requestBody = {
      any : {
        reversionRQ : {
          phoneNumber: "3998764643",
          value: "0",
          code: "NIT_1",
          messageId: "9857836163",
          type: "payment"
        }
      }
    }
    return requestBody;
  }
  
}
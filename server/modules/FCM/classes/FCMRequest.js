class FCMRequest {
  constructor(){
    this._FCMRequest = getBaseFCMRequest();
    this._customForAndroid = false;
  }
  setDestination(destination){
    this._FCMRequest.message.token = destination;
  }
  setNotificationTitle(title){
    this._FCMRequest.message.notification.title = title;
  }
  setNotificationBody(body){
    this._FCMRequest.message.notification.body = body;
  }
  setNotificationImage(imageURL){
    this._FCMRequest.message.notification.image=imageURL;
  }
  setAndroidIcon(drawIcon){
    if(!this._customForAndroid){
      this._FCMRequest.message.android.notification = {icon : drawIcon};
      this._customForAndroid = true;
    } else{
      this._FCMRequest.message.android.notification.icon = drawIcon;
    }
  }
  addKeyValueData(key, value){
    this._FCMRequest.message.data[key]=value;
  }
  delKeyValueData(key){
    delete this._FCMRequest.message.data[key];
  }
  getRequest(){
    return this._FCMRequest;
  }
}

function getBaseFCMRequest(){
  var fcmRequest = {
     message : {
      token : undefined, //This field must be filled with the token of the device
      //That it's what the users sees in the notifications bar
      notification : {
        title : 'Notification Title',
        body : 'Body text',
        image : undefined // Image URL -- JPEG, PNG and BMD supported
      },
      data : {
        //some data. This field it's our own responsability to handle in clientApp
      },
      android : {
        priority : "normal",
        ttl : '72000s',
        notification : undefined
      },
      apns : {
        headers : {
          'apns-priority' : '5'
        }
      }
    }
  };
  return fcmRequest;
}

module.exports = FCMRequest;

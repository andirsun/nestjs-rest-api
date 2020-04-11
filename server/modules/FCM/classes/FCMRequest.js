class FCMRequest {
  constructor(){
    this._FCMRequest = getBaseFCMRequest();
    this._customForAndroid = false;
    this._customForIOS = false;
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
    this.setAndroidCustom();
    this._FCMRequest.message.android.notification['icon'] = drawIcon;
  }
  setAndroidLightColor(color){
    // Color must be a color in format #rrggbb (HTML Color)
    this.setAndroidCustom();
    this._FCMRequest.message.android.notification['color'] = color;
  }
  setAndroidSound(sound){
    //The sound to play when the device receives the notification.
    //Supports "default" or the filename of a sound resource bundled in the app.
    // Sound files must reside in /res/raw/
    this.setAndroidCustom();
    this._FCMRequest.message.android.notification['sound'] = sound;
  }
  setIOSSound(sound){
    this.setIOSCustom();
    this._FCMRequest.message.apns.payload.aps['soundName'] = sound;
  }
  setAndroidClickAction(clickAction){
    //If present an activity with the right action filter starts action
    this.setAndroidCustom();
    this._FCMRequest.message.android.notification['click_action'] = clickAction;
  }
  setAndroidCustom(){
    if(!this._customForAndroid){
      this._FCMRequest.message.android.notification = {};
      this._customForAndroid = true;
    }
  }
  setIOSCustom(){
    if(!this._customForIOS){
      this._FCMRequest.message.apns['payload']={aps: {}};
      this._customForIOS = true;
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

var fcm = new FCMRequest();
fcm.setAndroidIcon('iconsito');
fcm.setAndroidLightColor('#FFFFFF');
fcm.setAndroidSound('default');
fcm.setAndroidClickAction('Some click action');
//fcm.setIOSSound('default');
console.log(fcm.getRequest().message.apns);

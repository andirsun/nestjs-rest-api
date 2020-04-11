require('dotenv').config({path:'.env'});
const fcmURL = process.env.TIMUGO_CLIENTS_FCM_URL;
const axios = require('axios');

let _request = undefined;

module.exports = {
  request : undefined,
  createNotification(title, body, image, mapedData, icon, to){
    //This setUP a new notitication message body
    const FCMRequest = require('./classes/FCMRequest');
    var req = new FCMRequest();
    req.setNotificationTitle(title);
    req.setNotificationBody(body);
    req.setNotificationImage(image);
    req.setDestination(to);
    req.setAndroidIcon(icon);
    //This loop add the key-value entries on mapedData that will be putted on
    //util payload of the notification
    for (var entry of mapedData.entries()){
      req.addKeyValueData(entry[0], entry[1]);
    }
    _request = req;
    return req;
  },
  setAndroidCustomization(color, sound, clickAction){
    if(color){
      _request.setAndroidLightColor(color);
    }
    if(sound){
      _request.setAndroidSound(sound);
    }
    if(clickAction){
      _request.setAndroidClickAction(clickAction);
    }
  },
  setIOSCustomization(sound){
    if(sound){
      _request.setIOSSound(sound);
    }
  },
  sendNotification(request){
    //This function send the http request to the FCM API with the right headers
    //And authorization credentials and scopes for FCM security
    if(!request){
      //Only it's useful when there exits a request notification to be sended
      console.log("You have not create a notification first");
    } else{
      const auth = require('./utils/auth');
      auth.getAccessToken().then(function(response) {
        var https = require('https');
        headers = {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + response //OATUH2 short-in-time token
        }
        const config = {
          method : 'POST',
          url : fcmURL,
          headers : headers,
          data : JSON.stringify(request._FCMRequest)
        }
        axios(config).then(function(resp){
          //Do somenthing with right response
          console.log(resp.data);
        }, function(err){
          //Do somenthing with err response
          console.log(err);
        });
      }, function(err){
        console.log('error', err);
      });
    }
  },
  getRequest(){
    return _request.getRequest();
  }
}
/* Little example of how to use the module
var data = new Map();
data.set('Barcelona', 'Messi');
data.set('I am', 'Driving me insane');
var mod = module.exports;
//mod.sendNotification();
mod.createNotification('La ultima.', 'Para ver si funciona con variables de entorno', undefined, data, undefined, process.env.MY_TOKEN);
//console.log(JSON.stringify(mod.request));
//If u want customization for different platforms use following lines
//mod.setAndroidCustomization('#FFCCDD', 'default', undefined);
//mod.setIOSCustomization('default');
console.log(JSON.stringify(mod.getRequest()));

mod.sendNotification(mod.getRequest());
//*/

const fcmURL = process.env.TIMUGO_BARBERS_FCM_URL;
const axios = require('axios');

var _request = {}; 

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
    if(!request){
      console.log("You have not create a notification first");
    } else{
      const auth = require('./utils/authBarbers');
      auth.getAccessToken().then(function(response) {
        var https = require('https');
        headers = {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + response
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
        console.log('error');
      });
    }
  }
}
/* Little example of how to use the module
var data = new Map();
data.set('Barcelona', 'Messi');
data.set('I am', 'Driving me insane');
var mod = module.exports;
//mod.sendNotification();
var request = mod.createNotification('Timugo Inc.', 'Timugo espera que todos y cada uno de los Colombianos se encuentren sanos y salvos. ¡Saldremos de esta!', 'https://i.pinimg.com/564x/2f/5b/38/2f5b38a87403a90833e1e859f6e18e0d.jpg', data, undefined, process.env.MY_TOKEN);
//console.log(JSON.stringify(mod.request));
mod.sendNotification(request);
*/

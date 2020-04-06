/*
  This script create a very short-in-time key to send request to FCM
  according to FCM V1 disposition, it returns a Authorization token that must be
  part of the header on the FCM V1 request.
*/

const { google } = require('googleapis');
const fs = require('fs');
const SCOPES = process.env.SCOPES;


function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var rawKey = fs.readFileSync(process.env.TIMUGO_CLIENTS_FCM_CREDENTIALS);
    var key = JSON.parse(rawKey);
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

module.exports = {getAccessToken};
/*
getAccessToken().then(function(response){
    console.log(response);
  },
  function(err){
    console.log(err);
});
//*/

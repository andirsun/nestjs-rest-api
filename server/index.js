//import libraries
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');


//initialize firebase inorder to access its services
admin.initializeApp();

// Express Servers
const {app} = require('./server');

// HTTP Cloud Functions
const apiv1 = functions.https.onRequest(app);
// const cors = functions.https.onRequest(corsServer);
// const cleanPath = functions.https.onRequest((request, response) => {
//   if (!request.path) {
//     request.url = `/${request.url}`; // Prepend '/' to keep query params if any
//   }

//   return cleanPathServer(request, response);
// });

module.exports = {
  apiv1
};
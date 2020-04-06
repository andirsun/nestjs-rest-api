require('dotenv').config({path:'.env'});

const express = require('express');
const app = express();
const https = require('https');
const socketIo = require('socket.io');
const cors = require('cors');

var fs = require('fs');

var key = ""
var cert = ""
var ca = ""

if (process.env.ENVIROMENT === 'dev') {
  console.log("Development Socket mode");
  key = fs.readFileSync('/etc/letsencrypt/live/timugotest.xyz/privkey.pem');
  cert = fs.readFileSync('/etc/letsencrypt/live/timugotest.xyz/cert.pem');
  ca = fs.readFileSync('/etc/letsencrypt/live/timugotest.xyz/chain.pem');
} else if ( process.env.ENVIROMENT === 'local') {
  console.log("Local Socket Mode");
} else if ( process.env.ENVIROMENT === 'prod') {
  console.log("Production Socket Mode");
  key = fs.readFileSync('/etc/letsencrypt/live/timugo.tk/privkey.pem');
  cert = fs.readFileSync('/etc/letsencrypt/live/timugo.tk/cert.pem');
  ca = fs.readFileSync('/etc/letsencrypt/live/timugo.tk/chain.pem');
}

var credentials = {key, cert, ca, requestCert : false, rejectUnauthorized: false};

const httpServer = https.createServer(credentials, app);
httpServer.listen(8000);
const server = socketIo(httpServer);

app.use(cors({origin:true,credentials:true}));
app.get('/test', (req, res) => {
	res.send('Socket server working with CORS');
});

let clientsConnected = new Map();
//The barber could be or not using the app, so the socket could'nt exist
//So we need an list to add the notifications when system can't connect with the barber app
let barbersNotifications = [];
//The same issue avoiding but with clients
let clientsNotification = [];

server.on('connection', (socket) => {
  console.log("New client requesting a socket connection");
  //There is a new connection but client doesn't commit handshake yet
  var phoneNumber = socket.handshake.query.phone;
  clientsConnected.set(phoneNumber, {socket, data : {}});
  socket.on('handshake', (data) => {
    clientsConnected.set(data.phoneNumber, {socket, data : data.data});
  });

  socket.on('orderChanged', (data) => {
    notifyBarber('orderChanged', data, {});
  });
  socket.on('orderCanceledByClient', (data) => {
    notifyBarber('orderCanceledByClient', data, {});
  });
  socket.on('orderCanceledByBarber', (data) => {
    notifyClient('orderCanceledByBarber', data, {});
  });
  socket.on('barberArrived', (data) => {
    notifyClient('barberArrived', data, {});
  });
  socket.on('orderFinished', (data) => {
    notifyClient('orderFinished', data, {});
  });
  socket.on('barberPosition', (data) => {
    notifyClient('barberPosition', data, {});
  });
});

function notifyBarber(emitType, dataIn, dataOut) {
  phoneBarber = dataIn.phoneNumberBarber;
  if (clientsConnected.has(phoneBarber)){
    barberSocket = clientsConnected.get(phoneBarber).socket;
    barberSocket.emit(emitType, dataOut);
  }else{
    barbersNotifications.push({phoneNumberBarber: phoneBarber, data : { emit : emitType, data : dataOut } });
    console.log('Barber is offline. Notification pushed into undelivered notifications');
  }
}

function notifyClient(emitType, dataIn, dataOut){
  phoneClient = dataIn.phoneUser;
  if(clientsConnected.has(phoneClient)){
    clientSocket = clientsConnected.get(phoneClient).socket;
    clientSocket.emit(emitType, dataOut);
  } else {
    clientsNotification.push({phoneUser: phoneClient, data : { emit: emitType, data : dataOut }});
    console.log('Client is offline. Notification pushed into undelivered notifications');
  }
}

function checkClientsNotifications(){
  clientsNotification.forEach((element, index, array) => {
    let phoneUser = element.phoneUser;
    if(clientsConnected.has(phoneUser)){
      socket = clientsConnected.get(phoneUser).socket;
      socket.emit(element.data.emit, element.data.data);
      array.splice(index, 1);
    }
  });
}

function checkBarbersNotifications(){
  barbersNotifications.forEach((element, index, array) => {
    let phoneBarber = element.phoneNumberBarber;
    if(clientsConnected.has(phoneBarber)){
      socket = clientsConnected.get(phoneBarber).socket;
      socket.emit(element.data.emit, element.data.data);
      array.splice(index, 1);
    }
  });
}

setInterval(() =>{
  checkBarbersNotifications();
  checkClientsNotifications();
}, 1000);


function startServer(app){

}
module.exports = server;

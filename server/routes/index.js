const express = require('express');
const app = express();
//////////////////
// This file exports all routes for the all apis used in the bacjkend, this routes
// will be use in the server.js file
socketServer = require('../sockets/serverSocket');
global.socketServer = socketServer;

app.use(require('./user'));
app.use(require('./barber'));
app.use(require('./order'));
app.use(require('./service'));
app.use(require('./admin'));
app.use(require('./payment'));



module.exports  = app; //export to use this file in server.js file

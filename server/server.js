require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
let server = http.createServer(app);
const publicPath = path.resolve(__dirname, '../public');

const client = require('twilio')("AC84fa440ef3fab3ec0388540866f2bb98","78ba97e4fbb62d01eef8f20364640712");
////////////////////////////////////

client.messages.create({
    from:'whatsapp:+573188758481',
    to: 'whatsapp:+573106838163',
    body: "hola mi rats"
}).then(message => console.log(message.sid));

app.use(express.static(publicPath));//access to data like images or anything else

app.use(morgan('dev'));
// Brings security in the api rest petitions
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index')); // import all routes 




//IO is the comunication with the backend

//let io = socketIO(server); //Conection to socket server
module.exports.io = socketIO(server);
require('./sockets/socket');




mongoose.connect(process.env.URLDB,
    {useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true}
    , (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
});
server.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
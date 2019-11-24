require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
////////////////////////////////////
app.use(morgan('dev'));
// Brings security in the api rest petitions
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index')); // import all routes 






mongoose.connect(process.env.URLDB,
    {useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true}
    , (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});
process.on('uncaughtException', function (error) {
    console.log(error.stack);
    
 });
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
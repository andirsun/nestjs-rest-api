const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
///////autoincremental id's 
//const AutoIncrement = require('mongoose-sequence')(mongoose);

let Schema = mongoose.Schema;
let log = new Schema({
  
  time: { 
    type: String,
    required:true, 
  },
  category: {
    type: String,
    required: [true,"Category is neccesary"]
  },
  description: {
    type: String,
    required: [true,"Description is  neccesary"]
  },
  associatedId: {
    type: Number,
    required: [false]
  }
});

log.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });
//Autoincremental id field
log.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = mongoose.model("Log", log);
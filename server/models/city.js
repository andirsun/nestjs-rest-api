const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let city = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: String,
    required:false, 
  },
  name: {
    type: String,
    required: [true, "El Nombre es necesario"]
  }
});

city.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("City", city);
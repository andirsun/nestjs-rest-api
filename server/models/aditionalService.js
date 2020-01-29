const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let validMethodTypes = {
  values: ["cash", "creditCard", "debitCard", "BonusCode"],
  message: "{VALUE} no es un metodo de pago valido"
};
let Schema = mongoose.Schema;

let aditionalService = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: Date,
    required:false,
    default: Date.now 
  },
  name: {
    type: String,
    required: [true, "El Nombre es necesario"]
  },
  price: {
    type: String,
    required: [true,"EL precio es necesario"]
  },
  description: {
    type: String,
    required: [true,"la descripcion es necesaria"]
  },
  urlImg: {
    type: String,
    required: [true, "La ruta de la imagen es necesaria"]
  }
});

aditionalService.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("aditionalService", aditionalService);
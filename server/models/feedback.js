const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let validMethodTypes = {
  values: ["cash", "creditCard", "debitCard", "BonusCode"],
  message: "{VALUE} no es un metodo de pago valido"
};
let Schema = mongoose.Schema;

let feedback = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: String,
    required:true, 
  },
  idUser: {
    type: Number,
    required: [true, "El id del usuario es necesario"]
  },
  nameUser: {
    type: String,
    required: [false]
  },
  feedback: {
    type: String,
    required: [true,"la descripcion es necesaria"]
  }
});

feedback.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Feedback", feedback);
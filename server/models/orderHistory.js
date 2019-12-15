const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let validMethodTypes = {
  values: ["cash", "creditCard", "debitCard", "BonusCode"],
  message: "{VALUE} no es un metodo de pago valido"
};
let Schema = mongoose.Schema;

let orderHistory = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  nameClient:{
    type: String,
    required:[true,"EL nombre del cliente es necesario"]
  },
  idClient: {
    type: Number,
    required: [true, "El id del cliente es necesario"]
  },
  idBarber:{
    type: Number,
    required: [false],
    default: 0
  },
  nameBarber:{
    type: String,
    required:[false],
    default: "Sin asignar"
  },
  address: {
    type: String,
    required: [true, "la direccion es necesaria"]
  },
  dateBeginOrder: {
    type: Date,
    required: [true, "La fecha de inicio del pedido es necesaria"]
  },
  dateFinishOrder: {
    type: Date,
    required: [false]
  },
  duration: {
    type: Number,
    required: [false]
  },
  stars: {
    type: Number,
    required: [false]
  },
  comments: {
    type: String,
    required: [true, "Los comentarios son obligatorios."]
  },
  price: {
    type: Number,
    required: [true, "El precio es necesario"]
  },
  typeService: {
    type: Number,
    required: [true, "El tipo de servicio es necesario"]
  },
  status: {
    type: Number,
    default: true,
    required: [true, "El status del servicio es necesario"]
  },
  payMethod: {
    type: String,
    required: [true, "el metodo de pago es necesario"],
    enum: validMethodTypes
  },
  bonusCode: {
    type: String,
    required: [false]
  },

  card: {
    type: String,
    default: 0,
    required: [false]
  }
});

orderHistory.methods.toJSON = function() {
  let order = this;
  let orderObject = order.toObject();
  delete orderObject.card;
  return orderObject;
};

orderHistory.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Order", orderHistory);

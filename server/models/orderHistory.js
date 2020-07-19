const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let validMethodTypes = {
  values: ["cash", "creditCard", "debitCard", "bonusCode"],
  message: "{VALUE} no es un metodo de pago valido"
};
let validStatusTypes = {
  values: ["Cancelled", "Finished"],
  message: "{VALUE} no es un metodo de pago valido"
};


let Schema = mongoose.Schema;
const address  = new Schema({
  city : String,
  address : String,
  favorite : Boolean,
  description:String,
  lat : String,
  lng : String,
});
let orderHistory = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: String,
    required:true, 
  },
  nameClient:{
    type: String,
  },
  idClient: {
    type: String,
    required: [true, "El id del cliente es necesario"]
  },
  idBarber:{
    type: Number,
    required: [false],
    default: 0
  },
  commission:{
    type : Number,
    required : [true,"La comision es necesaria"]
  },
  nameBarber:{
    type: String,
    required:[false],
    default: "Sin asignar"
  },
  /* New version of addres New API */
  newAddress : address,
  /* Deprecated version of address */
  address: {
    type: String
  },
  city:{
    type: String,
  },
  dateBeginOrder: {
    type: String,
    required: [true, "La fecha de inicio del pedido es necesaria"]
  },
  dateFinishOrder: {
    type: String,
    required: [false]
  },
  duration: {
    type: Number,
    required: [false]
  },
  rate: {
    type: Number,
    required: [false]
  },
  comments: {
    type: String,
    required: [true, "Los comentarios son obligatorios."]
  },
  services :[{
    idService : Number,
    nameService :String,
    typeService : String,
    price: Number,
    quantity:Number
  }],
  price: {
    type: Number,
    required: [true, "El precio es necesario"]
  },
  status: {
    type: String,
    default: true,
    enum: validStatusTypes
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

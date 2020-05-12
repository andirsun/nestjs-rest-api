const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let validMethodTypes = {
  values: ["cash", "creditCard", "debitCard", "BonusCode"],
  message: "{VALUE} no es un metodo de pago valido"
};


let Schema = mongoose.Schema;

let logPayment = new Schema({
  date : String,
  id1 : Number,
  codeQr : String,
  description : String
});

const address  = new Schema({
  city : String,
  address : String,
  favorite : Boolean,
  description:String,
  lat : String,
  lng : String,
});
let temporalOrder = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: String,
    required:true, 
  },
  idClient: {
    type: Number,
    required: [true, "El id del cliente es necesario"]
  },
  nameClient:{
    type: String,
    required:[true,"EL nombre del cliente es necesario"]
  },
  idBarber: {
    type: Number,
    required: [false]
  },
  nameBarber:{
    type: String,
    require:[false]
  },
  /*
  Temporal fix , the address in the V1.0 must be a 
  string and in the version 2.0 of create order
  must be a Addres Schema
  */
  newAddress: address,
  address : {
    type : String
  },
  city:{
    type: String,
    required: [true, "la ciudad es necesaria"]
  },
  dateBeginOrder: {
    type: String,
    required: [true, "La fecha de inicio del pedido es necesaria"]
  },
  hourStart: {
    type: String,
    required: [true, "La Hora de creacion es necesaria"]
  },
  hourEnd: {
    type: String,
    required: [false]
  },
  dateFinishOrder: {
    type: String,
    required: [false]
  },
  services :[{
    idService : Number,
    nameService :String,
    typeService : String,
    price: Number,
    quantity:Number
  }],
  pending : {
    type : Boolean,
    required:[true, "el estaod de pendiente es necesario"],
    default : true 
  },
  logPayment : [logPayment],
  status: {
    type: Boolean,
    default: true,
    required: [false]
  },
  price:{
    type: Number,
    required:[true, "EL precio es estrictamente necesario"]
  }
  
});

temporalOrder.methods.toJSON = function() {
  let order = this;
  let orderObject = order.toObject();
  //delete orderObject.card;
  return orderObject;
};

temporalOrder.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("TemporalOrder", temporalOrder);
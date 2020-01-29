const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let validMethodTypes = {
  values: ["cash", "creditCard", "debitCard", "BonusCode"],
  message: "{VALUE} no es un metodo de pago valido"
};
let Schema = mongoose.Schema;

let temporalOrder = new Schema({
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
  address: {
    type: String,
    required: [true,"la direccion es necesaria"]
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
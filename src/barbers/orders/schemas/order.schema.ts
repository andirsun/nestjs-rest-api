//File use for mongodb schemas
import { Schema } from "mongoose"; 
/* Mongoose plugins */
import uniqueValidator = require("mongoose-unique-validator");
/* Schemas */
import { ServiceSchema } from "src/pets/service/schemas/service.schema";
import { AddressSchema } from "src/barbers/user/schemas/address.schema";
import { LogPaymentSchema } from './logpayment.schema'
/** Moment js Time handler module */
import * as momentZone from 'moment-timezone';

let validStatus = {
  values: ["PENDING", "CANCELLED", "CONFIRMED", "FINISHED"],
  message: "{VALUE} no es un status válido"
};

export const orderSchema = new Schema({
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
    type: String,
    required: [true, "El id del cliente es necesario"]
  },
  nameClient:{
    type: String,
    required:[true,"EL nombre del cliente es necesario"]
  },
  idBarber: {
    type: String,
    required: [false]
  },
  nameBarber:{
    type: String,
    require:[false]
  },
  /* legacy version V1 anddress and city */
  address :String,
  city : String,
  /* New Address format */
  newAddress : AddressSchema,
  dateBeginOrder: {
    type: String,
    required: [true, "La fecha de inicio del pedido es necesaria"],
    default : momentZone().tz('America/Bogota').format("YYYY-MM-DD HH:mm")
  },
  dateArriveBarber : {
    type : String,
  },
  hourStart: {
    type: String,
    required: [true, "La Hora de creacion es necesaria"],
    default : momentZone().tz('America/Bogota').format("HH:mm")
  },
  serviceDuration:{
    type : String
  },
  orderDuration :{
    type : String
  },
  dateFinishOrder: {
    type: String,
    required: [false]
  },
  hourEnd: {
    type: String,
    required: [false]
  },
  services :[ServiceSchema],
  pending : {
    type : Boolean,
    required:[true, "el estado pendiente es necesario"],
    default : true 
  },
  logPayment : [LogPaymentSchema],
  status: {
    type: String,
    default: "PENDING",
    enum: validStatus
  },
  price:{
    type: Number,
    required:[true, "EL precio es estrictamente necesario"]
  },
  img: {
    type: String,
    // required:[true, "La imagen es necesaria"]
  }
});

/*PLUGINS ZONE*/
// Plugin to make unique validator
orderSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });
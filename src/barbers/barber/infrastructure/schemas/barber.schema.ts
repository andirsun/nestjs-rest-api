/* Mongoose dependencies */
import { Schema } from "mongoose";
/* Schemas */
import { DeviceInfoSchema } from "./deviceInfo.schema";
import { PaymentSchema } from "./payments.schema";

export const BarberSchema = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: String,
    required:false, 
  },
  balance :{
    type:Number,
    default : 0,
  },
  connected:{
    type : Boolean,
    default : false
  },
  name: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  lastName: {
    type: String,
    required: [true, "Los apellidos son necesarios"]
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "Es necesario el numero de celular"]
  },
  phoneToken:{
    type:String,
    required:false
  },
  bio: {
    type: String,
    required: [false]
  },
  points: {
    type: Number,
    required: false,
    default:0
  },
  stairs:{
    type: Number,
    required:[false],
    default: 5
  },
  numberServices:{
    type: Number,
    required:[false],
    default:0
  },
  document: {
    type: Number,
    unique: true,
    required: [true, "Es necesario el documentooo"]
  },
  birth: {
    type: Date,
    required: [true, "La edad es necesaria"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Este correo ya esta registrado"]
  },
  password: {
    type: String,
    required: [false]
  },
  address: {
    type: String,
    required: [true, "La direccion es necesaria"]
  },
  city:{
    type: String,
    required: [true, "la ciudad es necesaria"]
  },
  urlImg:{
    type: String,
    required:[false],
    default: "sin asignar"
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "REGULAR",
  },
  deviceInfo : [DeviceInfoSchema],
  status: {
    type: Boolean,
    default: true
  },
  payments : [PaymentSchema]
});

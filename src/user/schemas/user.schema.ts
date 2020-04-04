//File use for mongodb schemas
import { Schema } from "mongoose"; 
import uniqueValidator = require("mongoose-unique-validator");
/*Aditional Required Schemas*/ 
import { AddressSchema } from "./address.schema";
import { CardSchema } from "./card.schema";


let rolesValidos = {
    values: ["USER_ROLE", "USER_VIP_ROLE"],
    message: "{VALUE} no es un rol válido"
};

export const UserSchema = new Schema({
  id: {
      type: Number,
      require: [true, "EL id es necesario"],
      default: 0
  },
  phoneToken:{
    type:String,
    default:"none"
  },
  updated: { 
    type: String,
    required:false, 
  },
  name: {
    type: String,
    required: false
  },
  registrationCode :{
    type : String,
    require: [true,"Es necesario el mismo"]
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "Es necesario el numero de celular"]
  },
  birth: {
    type: Date,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  addresses : [AddressSchema],
  img: {
    type: String,
    required: false
  },
  numServices:{
    type : Number,
    required:false,
    default:0
  },
  points: {
    type: Number,
    required: false,
    default:0
  },
  status: {
    type: Boolean,
    default: true
  },
  cards : [CardSchema],
  publicityMethod:{
    type: String,
    default: "none"
  }
});
/*PLUGINS ZONE*/
// Plugin to make unique validator
UserSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });



//File use for mongodb schemas
import { Schema } from "mongoose"; 
import uniqueValidator = require("mongoose-unique-validator");
//import mongoose = require('mongoose');
//const AutoIncrement = require('mongoose-sequence')(mongoose);
/*Aditional Required Schemas*/ 
import { AddressSchema } from "./address.schema";
import { CardSchema } from "./card.schema";
import { NequiSchema } from "./nequi.schema";
import { UserPromCodeSchema } from "./user-promcode.schema";
import { User } from "../../domain/interfaces/user.interface";
//Services 


let validRoles = {
  values: ["USER_ROLE", "REFERRED_USER_ROLE"],
  message: "{VALUE} is not a valid Role"
};

export const UserSchema = new Schema<User>({
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
  lastConnection: {
    type : String,
    default : ""
  },
  registrationDate:{
    type : String,
    required : [true, "La fecha de registro es necesaria"]
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
  cards : [CardSchema],
  nequiAccounts : [NequiSchema],
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
  role: {
    type: String,
    default: "USER_ROLE",
    enum: validRoles
  },
  status: {
    type: Boolean,
    default: true
  },
  publicityMethod:{
    type: String,
    default: "none"
  },
  promotionalCodes:[UserPromCodeSchema]
});
/*PLUGINS ZONE*/
// Plugin to make unique validator
UserSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

//UserSchema.plugin(AutoIncrement, {inc_field: 'id'});



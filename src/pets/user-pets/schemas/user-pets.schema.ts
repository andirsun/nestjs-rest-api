//File use for mongodb schemas
import { Schema } from "mongoose"; 

import uniqueValidator = require("mongoose-unique-validator");
//import mongoose = require('mongoose');
//const AutoIncrement = require('mongoose-sequence')(mongoose);
/*Aditional Required Schemas*/ 
import { AddressSchema } from "./address.schema";
import { CardSchema } from "./card.schema";
import { NequiSchema } from "./nequi.schema";
import { ShoppingCartPetsSchema } from "./shoppingCart.schema";



let rolesValidos = {
    values: ["USER_ROLE", "USER_VIP_ROLE"],
    message: "{VALUE} no es un rol válido"
};

export const UserPetsSchema = new Schema({
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
  },
  phone: {
    type: String,
    unique: true,
    //required: [true, "Es necesario el numero de celular"]
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
  numOrders:{
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
    enum: rolesValidos
  },
  status: {
    type: Boolean,
    default: true
  },
  //shoppingCart : [ShoppingCartPetsSchema],
  publicityMethod:{
    type: String,
    default: "none"
  },
  registerMethod :{
    type : String,
  }
});
/*PLUGINS ZONE*/
// Plugin to make unique validator
UserPetsSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

//UserSchema.plugin(AutoIncrement, {inc_field: 'id'});



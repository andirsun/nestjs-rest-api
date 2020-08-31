//File use for mongodb schemas
import { Schema } from "mongoose"; 
import uniqueValidator = require("mongoose-unique-validator");
/*Aditional Required Schemas*/ 
import { AddressSchema } from "./address.schema";
import { CardSchema } from "./card.schema";
import { NequiSchema } from "./nequi.schema";
import { UserPromCodeSchema } from "./user-promcode.schema";
//Interfaces
import { User } from "../../domain/interfaces/user.interface";
 

//User valid Roles
let validRoles = {
  values: ["USER_ROLE", "REFERRED_USER_ROLE"],
  message: "{VALUE} is not a valid Role"
};
// Valid Registration Methods
let validRegistrationMethods = {
  values: ["FACEBOOK", "APPLE", "PHONE"],
  message: "{VALUE} is not a valid method"
};
export const UserSchema = new Schema<User>({
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
  registrationMethod :{
    type : String,
    required : [true, "El metodo de registro es necesario"],
    enum : validRegistrationMethods,
  },
  promotionalCodes:[UserPromCodeSchema]
});
/*PLUGINS ZONE*/
// Plugin to make unique validator
UserSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });



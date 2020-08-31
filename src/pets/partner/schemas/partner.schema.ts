//File use for mongodb schemas
import { Schema } from "mongoose"; 
import * as bcrypt from 'bcrypt';
import uniqueValidator = require("mongoose-unique-validator");
//import mongoose = require('mongoose');
//const AutoIncrement = require('mongoose-sequence')(mongoose);
/*Aditional Required Schemas*/ 
import { NequiSchema } from "./nequiAccount.schema";
import { ServiceSchema } from "../../service/schemas/service.schema";
import { BankAccountSchema } from "./bankAccount.schema";
import { PaymentSchema } from "./payment.schema";
import { DispersionSchema } from "./dispersion.schema";
import { DeviceSchema } from "./device.schema";
import { DiscountSchema } from "../../products/schemas/discount.schema";
import { CommentSchema } from "./comment.schema";
/* Interfaces */
import { Partner } from "../interfaces/partner.interface";


export const PartnerSchema: Schema = new Schema({
  status: {
    type: Boolean,
    default: false
  },
	phone: {
		type: Number,
		unique: true,
		required: [true, "Es necesario el numero de celular"]
	},
	numOrders:{
		type : Number,
		default:0
	},
	password :{type:String},
	businessName: {type: String,unique : true},
	landLine: {type: Number,},
  phoneToken:{type:String},
  updated: { type: String},
  appName: {type: String},
  idNumber :{type : Number},
  address: {type: String,},
  email: {type: String},
  img: {type: String,},
  description:{type: String,},
	logo:{type: String,},
	rutFile:{type: String},
	idCardFile:{type: String,},
	contractFile:{type: String,},
	services : [ServiceSchema],
	products : [String],//onli products is are saved here no schemas
	nequiAccount : [NequiSchema],
	bankAccount : BankAccountSchema,
	payments : [PaymentSchema],
	dispersions : [DispersionSchema],
	devices : [DeviceSchema],
	discounts:[DiscountSchema],
	comments : [CommentSchema],
});

PartnerSchema.pre<Partner>('save', function(next){
	
  let user = this;

  // Make sure not to rehash the password if it is already hashed
  if(!user.isModified('password')){
		console.log("ya se habia modificado");
		return next();
	} 

  // Generate a salt and use it to hash the user's password
  // Store hash in your password DB.
	bcrypt.genSalt(10, (err, salt) => {

      if(err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {

          if(err) return next(err);
          user.password = hash;
          next();

      });

  });

}); 
/*PLUGINS ZONE*/
// Plugin to make unique validator
PartnerSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

//File use for mongodb schemas
import { Schema } from "mongoose"; 
import uniqueValidator = require("mongoose-unique-validator");
//import mongoose = require('mongoose');
//const AutoIncrement = require('mongoose-sequence')(mongoose);
/*Aditional Required Schemas*/ 
import { NequiSchema } from "./nequiAccount.schema";
import { ProductSchema } from "./product.schema";
import { ServiceSchema } from "./service.schema";
import { BankAccountSchema } from "./bankAccount.schema";
import { PaymentSchema } from "./payment.schema";
import { DispersionSchema } from "./dispersion.schema";
import { DeviceSchema } from "./device.schema";
import { DiscountSchema } from "./discount.schema";
import { CommentSchema } from "./comment.schema";

export const PartnerSchema = new Schema({
  id: {
		type: Number,
		require: [true, "EL id es necesario"],
		default: 0
  },
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
	landline: {type: Number, unique :true},
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
	products : [ProductSchema],
	nequiAccount : [NequiSchema],
	bankAccount : BankAccountSchema,
	payments : [PaymentSchema],
	dispersions : [DispersionSchema],
	devices : [DeviceSchema],
	discounts:[DiscountSchema],
	comments : [CommentSchema],
});

/*PLUGINS ZONE*/
// Plugin to make unique validator
PartnerSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

//UserSchema.plugin(AutoIncrement, {inc_field: 'id'});
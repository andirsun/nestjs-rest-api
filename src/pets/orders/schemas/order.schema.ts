/* Mongoose dependencies */
import { Schema } from "mongoose";
import uniqueValidator = require("mongoose-unique-validator");
/* Schemas */
import { AddressSchema } from "./address.schema";
import { CommentPetOrder } from "./comment.schema";
import { ProductSchema } from "src/pets/products/schemas/product.schema";
import { DiscountCodeSchema } from "./discountCode.schema";
import { PaymentMethodSchema } from "./paymentMethod.schema";
/* Interface */
import { OrderPetsInterface } from "../interfaces/order.interface";
import { OrderHistorySchema } from "./historyOrder.schema";


export const OrderPetsSchema = new Schema<OrderPetsInterface>({
  status: { //ACTIVE | PREPARING | DISPATCHED | RECIEVED | FINALIZED
    type: String,
    default: true,
  },
  updated: { 
    type: String,
    required:true, 
  },
  nameClient:{
    type: String,
    required:[true,"EL nombre del cliente es necesario"]
  },
  phoneClient:{
    type: String,
  },
  emailClient:{
    type: String,
    required:[true,"EL correo del cliente es necesario"]
  },
  idClient: {
    type: String,
    required: [true, "El id del cliente es necesario"]
  },
  idPartner:{
    type: String,
    required: [true, "El id del Aliado es necesario"],
  },
  namePartner:{
    type: String,
    required:[true , "El nombre del aliado es neceasario"]
  },
  commission:{
    type : Number,
    required : [true,"La comision es necesaria"]
  },
  //address: AddressSchema, //Address V2 
  address : {
    type: String,
    required : [true, "La Direccion es necesaria"]
  },
  dateBeginOrder: {
    type: String,
    required: [true, "La fecha de inicio del pedido es necesaria"]
  },
  hourStart : {
    type: String
  },
  dateFinishOrder: {
    type: String,
    required: [false]
  },
  rate: {
    type: Number,
    required: [false]
  },
  comment: CommentPetOrder,
  orderDuration :{
    type : Number
  },
  products :[ProductSchema],
  totalAmount: {
    type: Number,
    required: [true, "El precio es necesario"]
  },
  paymentStatus :{
    type : Boolean
  },
  paymentMethod: PaymentMethodSchema,
  discountCode: DiscountCodeSchema,
  history : [OrderHistorySchema],
  logPayment : [String]
});
OrderPetsSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });
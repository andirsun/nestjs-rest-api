import { Schema } from "mongoose";

export const PaymentSchema = new Schema({
  date : String,
  type : String, //PAYMENT  | DISPERSION
  amount : Number,
  paymentId : String, // Nequi Payment reference
  ip : String
})
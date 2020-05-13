import { Schema } from "mongoose";

export const PaymentSchema = new Schema({
  date : String,
  type : String, //Payment  | Dispersion
  amount : Number,
  paymentId : Number

})
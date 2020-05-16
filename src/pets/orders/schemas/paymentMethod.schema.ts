import { Schema } from "mongoose";

export const PaymentMethodSchema = new Schema({
  id : String, //id of payment method not document
  type :{
    type : String,
    default : "CASH"
  } , // Nequi | Card | Cash | PSE | Bancolombia
})
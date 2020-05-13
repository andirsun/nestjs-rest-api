import { Schema } from "mongoose";

export const PaymentMethodSchema = new Schema({
  id : String,
  type :{
    type : String,
    default : "CASH"
  } , // Nequi | Card | Cash | PSE | Bancolombia
})
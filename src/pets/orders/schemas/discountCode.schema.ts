import { Schema } from "mongoose";

export const DiscountCodeSchema = new Schema({
  id : String,
  code :{
    type : String,
    default : "none"
  },
  percentage : Number
})
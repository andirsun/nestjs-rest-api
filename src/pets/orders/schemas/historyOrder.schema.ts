import { Schema } from "mongoose";

export const OrderHistorySchema = new Schema({
  date : String,
  description : String,
  relatedId : String,
});
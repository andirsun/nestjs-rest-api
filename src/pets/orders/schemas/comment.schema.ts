import { Schema } from "mongoose";

export const CommentPetOrder = new Schema({
  id : Number,
  date : String,
  urlImg : String,
  rate : Number,
  comment : String
})
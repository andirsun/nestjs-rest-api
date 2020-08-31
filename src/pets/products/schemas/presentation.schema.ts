import { Schema } from "mongoose";

export const PresentationSchema = new Schema({
  reference : String,
  status :String, // archived | outOfstock | available |unavailable 
  sizes : String,
  volume : String,
  weigth : String,
  stock : Number,
  description : String, //could be color, taste or other caracteristic   
  price : Number,
  urlImg : String,
});
import { Schema } from "mongoose";

export const AddressSchema = new Schema({ 
    city : String,
    address : String,
    favorite : Boolean,
    description:String,
    lat : String,
    lng : String,  
  
})
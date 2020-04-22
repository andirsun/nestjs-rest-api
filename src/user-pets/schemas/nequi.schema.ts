import { Schema } from "mongoose"; 

export const NequiSchema = new Schema({
    id:Number,
    favorite : Boolean,
    type : String,
    phone : String,
    document:String,
    date : String,
    token : String
});
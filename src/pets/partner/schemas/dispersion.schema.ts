import { Schema } from "mongoose"; 

export const DispersionSchema = new Schema({
    id : Number,
    status : String,
    date: String,
    amount : Number,
});
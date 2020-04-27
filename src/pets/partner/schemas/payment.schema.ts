import { Schema } from "mongoose"; 

export const PaymentSchema = new Schema({
    id : Number,
    status : String,
    date: String,
    amount : Number,
});
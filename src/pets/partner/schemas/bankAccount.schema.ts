import { Schema } from "mongoose"; 

export const BankAccountSchema = new Schema({
    bank :String,
    number : Number,
    name : String,
    idNumber : Number,
    type : String
});
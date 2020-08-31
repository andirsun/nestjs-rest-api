import { Schema } from "mongoose"; 

export const CardSchema = new Schema({
    id:Number,
    wompiCode :String,
    favorite : Boolean,
    type: String,
    nameCard : String,
    lastName : String,
    cardNumber : String,
    monthExpiraton : String,
    yearExpiration : String,
    last4Numbers : String,
    cvc:String,
    brand:String
});
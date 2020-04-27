import { Schema } from "mongoose"; 

/* Aditional Schema */
const PresentationsDiscount = new Schema ({
    idPresentation : String,
    percentage : Number, 
});
/* Principal Schema to ecport */
export const DiscountSchema = new Schema({
    id : Number,
    cupon : String, //optional
    presentations : [PresentationsDiscount], 
    date : String, 
    status :String, // active , disabled
    percetage  : Number,
});

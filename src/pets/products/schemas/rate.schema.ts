/* Use the moongose schema to build the schema */
import { Schema } from "mongoose"


export const RateSchema = new Schema({
    id : Number,
    date : String,
    starts : Number,
    comment : String ,
    idUser : String , 
    nameUser : String
});
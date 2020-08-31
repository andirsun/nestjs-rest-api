/* Use the moongose schema to build the schema */
import { Schema } from "mongoose"


export const RateSchema = new Schema({
    date :String,
    id : Number ,
    userId : Number,
    nameUser : String,
    comment : String, 
    stars :Number,
    img : String,
})
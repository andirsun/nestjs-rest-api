/* Import mongoose Schemas */
import { Schema } from "mongoose"; 
import { RateSchema } from "./rate.schema";
import { PresentationSchema } from "./presentation.schema";
import uniqueValidator = require("mongoose-unique-validator");

/* Principal Schema to export */
export const ProductSchema = new Schema({
    idPartner : {
        type : String,
        required :[true, "El id del creador es necesario"]
    },
    status :{
        type :String, //available | unavailable | pending | rejected | archived |
        default  : "available"
    },
    name : {
        type : String,
        required :[true,"El nombre es necesario"]
    },
    characteristics : {
        type : String,
        required : [true,"Las caracteristicas son necesarias"]
    },
    img : {
        type : String,
        required : [true,"la imagen es necesaria"]
    },
    deliveryDays : {
        type : Number,
        required : [true,"EL tiempo de delivery es necesario "]
    },
    description : {
        type : String,
        required : [true,"La descripcion es necesaria"]
    },
    reference : {
        type : String,
    },
    orders : Number,
    benefits : String,
    rateStars : Number,
    tags : [String], //example ["food",cat food]
    favorites : Number,
    usersRates : [RateSchema],
    presentations : [PresentationSchema], 
});
/* PLugin Validator */
ProductSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });



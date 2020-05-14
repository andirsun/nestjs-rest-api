/* Mongoose dependencies */
import { Schema } from "mongoose";
/* MOngoose plugins */
import uniqueValidator = require("mongoose-unique-validator");

/* This schema have less stributes than products presnetation */
const ProductPresentationPetsOrderSchema = new Schema({
  urlImg : String,
  reference : String,
  sizes : String,
  volume : String,
  weigth : String,
  description : String, //could be color, taste or other caracteristic   
  units : Number,
  price : Number,
});
/* Principal Schema to export */
export const ProductPetsOrderSchema = new Schema({
    idPartner : {
        type : String,
        required :[true, "El id del creador es necesario"]
    },
    img : {
        type : String,
        required : [true,"la imagen es necesaria"]
    },
    deliveryDays : {
        type : Number,
        required : [true,"EL tiempo de delivery es necesario "]
    },
    name : {
        type : String,
        required :[true,"El nombre es necesario"]
    },
    description : {
        type : String,
        required : [true,"La descripcion es necesaria"]
    },
    characteristics : {
        type : String,
        required : [true,"Las caracteristicas son necesarias"]
    },
    benefits : String,
    presentations : [ProductPresentationPetsOrderSchema], 
});
/* PLugin Validator */
ProductPetsOrderSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

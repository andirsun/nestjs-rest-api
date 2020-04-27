import { Schema } from "mongoose"; 

/* Aditional schemas */
const Presentation = new Schema({
    id : Number,
    status :String, // archived | outOfstock | available |unavailable 
    sizes : String,
    volume : String,
    weigth : String,
    stock : Number,
    description : String, //could be color, taste or other caracteristic   
    price : Number,
    urlImg : String,
});
const Rate = new Schema({
    date :String,
    id : Number ,
    userId : Number,
    nameUser : String,
    comment : String, 
    stars :Number,
    img : String,
})
/* Principal Schema to export */
export const ProductSchema = new Schema({
    id : Number,
    orders : Number,
    status :String, //available | unavailable | pending | rejected | archived |
    presentations : [Presentation], 
    descripcion : String,
    rateStars : Number,
    typeTags : [String], //example ["food",cat food]
    usersRates : [Rate],
    favorites : Number,
});


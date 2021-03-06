/*Aditional interfaces */
import { Rate } from "./rates.interface";
import { Document } from "mongoose";

export interface Product extends Document {
    
    idPartner : string,
    //namePartner : string,
    name : string,
    orders : number,
    status :string, //available | unavailable | pending | rejected | archived |
    presentations : [Presentation], 
    descripcion : string,
    rateStars : number,
    tags : [string], //example ["food",cat food]
    usersRates : [Rate],
    favorites : number,
    characteristics : string,
    img :string,
    deliveryDays : number,
    benefits : string,
};
/* Aditional local interfaces*/
export interface Presentation extends Document {
    reference : string,
    status :string, // archived | outOfstock | available |unavailable 
    sizes : string,
    volume : string,
    weigth : string,
    stock : number,
    description : string, //could be color, taste or other caracteristic   
    price : number,
    urlImg : string
};

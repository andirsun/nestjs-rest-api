/*Aditional interfaces */
import { Rate } from "./rates.interface";

export interface Product {
    readonly id : number
    readonly orders : number
    readonly status :string, //available | unavailable | pending | rejected | archived |
    readonly presentations : [Presentation], 
    readonly descripcion : string,
    readonly rateStars : number,
    readonly typeTags : [string] //example ["food",cat food]
    readonly usersRates : [Rate]
    readonly favorites : number
};
/* Aditional local interfaces*/
interface Presentation  {
    readonly id : number
    readonly status :string // archived | outOfstock | available |unavailable 
    readonly sizes : string,
    readonly volume : string,
    readonly weigth : string,
    readonly stock : number
    readonly description : string //could be color, taste or other caracteristic   
    readonly price : number
    readonly urlImg : string
};

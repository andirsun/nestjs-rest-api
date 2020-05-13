// This interfaces works to autocomplete the objects when type code
import { Address } from "./address.interface";
import { Card } from "./card.interface";
import { Document } from "mongoose";



export interface UserPets extends Document {
    _id: string,
    phone: number ,
    phoneToken:string,
    updated: string,
    name: string,
    registrationCode :string,
    birth: string,
    email: string,
    addresses : [Address],
    img: string,
    numOrders:number,
    points: number,
    status: boolean,
    cards : [Card],
    publicityMethod:string
};
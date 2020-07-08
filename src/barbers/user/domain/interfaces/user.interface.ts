// This interfaces works to autocomplete the objects when type code
import { Address } from "./address.interface";
import { Card } from "./card.interface";
import { Document } from "mongoose";
import { UserPromCodeInterface } from "./user-promcode.interface";



export interface User extends Document {
    id: number,
    phoneToken:string,
    updated: string,
    lastConection : string,
    name: string,
    registrationDate : string,
    registrationCode :string,
    phone: number,
    birth: string,
    email: string,
    addresses : [Address],
    img: string,
    numServices:string,
    points: number,
    status: boolean,
    cards : [Card],
    publicityMethod:string,
    promotionalCodes:[UserPromCodeInterface]
};
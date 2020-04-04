// This interfaces works to autocomplete the objects when type code
import { Address } from "./address.interface";
import { Card } from "./card.interface";
import { Document } from "mongoose";



export interface User extends Document {
    readonly id: number,
    readonly phoneToken:string,
    readonly updated: string,
    readonly name: string,
    readonly registrationCode :string,
    readonly phone: string,
    readonly birth: string,
    readonly email: string,
    readonly addresses : [Address],
    readonly img: string,
    readonly numServices:string,
    readonly points: number,
    readonly status: boolean,
    readonly cards : [Card],
    readonly publicityMethod:string
};
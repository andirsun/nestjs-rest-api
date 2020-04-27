/* External interfaces to inject in the partener interface */
import { BankAccount } from "./bankAccount.interface";
import { NequiAccount } from "./nequiAccount.interface";
import { Comment } from "./comments.interface";
import { Product } from "./product.interface";
import { Service } from "./service.interface";
/* Mongoose dependencies */
import { Document } from "mongoose";
/* 
    Principal interface to export 
    Needs to extends a mongoose document
    to be used in the parter.service like a model
*/
export interface Partner extends Document {
    readonly id: number,
    readonly status: boolean,
    readonly idNumber : number
    readonly numOrders:number,
    readonly phoneToken:string,
    readonly products: [Product],
    readonly services: [Service],
    readonly payments : ["debe tener estado pendiente - pagado"]
    readonly devices : [ "devices"]
    readonly businessName: string,
    readonly appName :string,
    readonly landline: number,
    readonly phone : number
    readonly description : string,
    readonly email: string,
    readonly logo: string,
    readonly nequiAccount : NequiAccount
    readonly bankAccount : BankAccount,
    readonly rutFile : string,
    readonly idCardFile : string,
    readonly contractFile : string,
    readonly discounts: [Discount],
    readonly comments : [Comment] 
};
/* 
    Aditional local  interfaces 
*/
interface Discount {
    readonly id : number,
    readonly cupon : string, //optional
    readonly presentations : [PresentationsDiscount], 
    readonly date : string, 
    readonly status :string, // active , disabled
    readonly percetage  : number,
};
interface PresentationsDiscount {
    readonly idPresentation : string,
    readonly percentage : number, 
};



    
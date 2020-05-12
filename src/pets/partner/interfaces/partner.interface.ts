/* External interfaces to inject in the partener interface */
import { BankAccount } from "./bankAccount.interface";
import { NequiAccount } from "./nequiAccount.interface";
import { Comment } from "./comments.interface";
import { Product } from "../../products/interfaces/product.interface";
import { Service } from "./service.interface";
/* Mongoose dependencies */
import { Document } from "mongoose";
/* 
    Principal interface to export 
    Needs to extends a mongoose document
    to be used in the parter.service like a model
*/
export interface Partner extends Document {
    id: number,
    status: boolean,
    idNumber : number,
    password : string,
    numOrders:number,
    phoneToken:string,
    products: [string],
    services: [Service],
    payments : ["debe tener estado pendiente - pagado"]
    devices : [ "devices"]
    businessName: string,
    appName :string,
    landLine: number,
    phone : number
    description : string,
    email: string,
    logo: string,
    nequiAccount : NequiAccount
    bankAccount : BankAccount,
    rutFile : string,
    idCardFile : string,
    contractFile : string,
    discounts: [Discount],
    comments : [Comment] 
};
/* 
    Aditional local  interfaces 
*/
interface Discount {
    id : number,
    code : string, //optional
    presentations : [PresentationsDiscount], 
    date : string, 
    status :string, // active , disabled
    percentage  : number,
};
interface PresentationsDiscount {
    idPresentation : string,
    percentage : number, 
};



    
/* Mongoose dependencies */
import { Document } from "mongoose";
/* Interfaces */
import { Address } from "./address.interface";
import { Product } from "../../products/interfaces/product.interface";
import { CommentInterface } from "./comment.interface";
import { PaymentMethodInterface } from "./paymentMethod.interface";

export interface OrderPetsInterface extends Document {
  _id : string,
  status : string,
  updated : string,
  idClient : string,
  phoneClient : number,
  nameClient : string,
  idPartner : number,
  namePartner : string,
  commision : number,
  address : Address,
  dateBeginOrder: string,
  hourStart : string,
  dateFinishOrder : string,
  rate : number,
  comment : CommentInterface
  orderDuration : number,
  products : [Product],
  totalAmount : number,
  paymentStatus : boolean,
  paymentMethod : PaymentMethodInterface
  logPayment : [string],
}
/* Mongoose dependencies */
import { Document } from "mongoose";
/* Interfaces */
import { Address } from "./address.interface";
import { CommentInterface } from "./comment.interface";
import { PaymentMethodInterface } from "./paymentMethod.interface";
import { ProductInterfaceOrder } from "./productOrder.interface";

export interface OrderPetsInterface extends Document {
  _id : string,
  status : string,
  updated : string,
  idClient : string,
  phoneClient : number,
  nameClient : string,
  idPartner : string,
  namePartner : string,
  commision : number,
  address : Address,
  dateBeginOrder: string,
  hourStart : string,
  dateFinishOrder : string,
  rate : number,
  comment : CommentInterface
  orderDuration : number,
  products : [ProductInterfaceOrder],
  totalAmount : number,
  paymentStatus : boolean,
  paymentMethod : PaymentMethodInterface
  logPayment : [string],
}
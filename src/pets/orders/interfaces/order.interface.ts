/* Mongoose dependencies */
import { Document } from "mongoose";
/* Interfaces */
import { Address } from "./address.interface";
import { CommentInterface } from "./comment.interface";
import { PaymentMethodInterface } from "./paymentMethod.interface";
import { ProductInterfaceOrder } from "./productOrder.interface";
import { OrderHistoryInterface } from "./historyOrder.interface";

export interface OrderPetsInterface extends Document {
  _id : string,
  status : string, //ACTIVE | PREPARING | DISPATCHED | RECIEVED | FINALIZED
  updated : string,
  idClient : string,
  phoneClient : number,
  nameClient : string,
  idPartner : string,
  namePartner : string,
  commision : number,
  //address : Address, //address v2.0
  address : string, //addres V1.0
  dateBeginOrder: string,
  hourStart : string,
  dateFinishOrder : string,
  rate : number,
  comment : CommentInterface
  orderDuration : number,
  products : [ProductInterfaceOrder],
  totalAmount : number,
  paymentStatus : boolean,
  history : [OrderHistoryInterface],
  paymentMethod : PaymentMethodInterface
  logPayment : [string],
}
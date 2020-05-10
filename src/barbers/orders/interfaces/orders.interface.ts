/* Interfaces */
import { Address } from "../../user/interfaces/address.interface";
import { orderService } from "../interfaces/serviceOrder.interface";
import { Document } from "mongoose";
/*
  Temporal order interface
*/
export interface barberyOrder extends Document {
  id : number,
  updated : string,
  idClient : string,
  nameClient : string,
  idBarber : number,
  address : Address | string,
  dateBeginOrder: string,
  dateArriveBarber: string,
  hourStart : string,
  serviceDuration : number,
  orderDuration : number,
  dateFinishOrder : string,
  hourEnd: string,
  services : orderService,
  pending : boolean,
  logPayment : [string],
  status : boolean,
  price : number
}

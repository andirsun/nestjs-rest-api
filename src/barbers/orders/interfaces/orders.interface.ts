/* Mongoose Dependencies*/
import { Document } from "mongoose";
/* Interfaces */
import { Address } from "../../user/interfaces/address.interface";
import { ServiceOrderRepository } from "./service.interface";
import { LogPaymentInterface } from './logpayment.interface';

/*
  Temporal order interface
*/
export interface barberyOrder extends Document {
  id : number,
  updated : string,
  idClient : string,
  nameClient : string,
  idBarber : string,
  /* Retrocompatibility with old address */
  //city : string,
  //address : string,
  /* New Address */
  newAddress : Address,
  dateBeginOrder: string,
  dateArriveBarber: string,
  hourStart : string,
  serviceDuration : number,
  orderDuration : number,
  dateFinishOrder : string,
  hourEnd: string,
  services : [ServiceOrderRepository],
  logPayment : [LogPaymentInterface],
  pending : boolean,
  // status : string,
  price : number,
  img: string
}

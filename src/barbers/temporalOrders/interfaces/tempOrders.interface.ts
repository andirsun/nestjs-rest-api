import { Document } from 'mongoose';

/*INterfaces*/
import { ServiceInterface } from './service.interface';
import { Address } from 'src/barbers/user/interfaces/address.interface';
import { LogPaymentInterface } from './logpayment.interface';



export interface TempOrder extends Document{
  id: number,
  updated: string,
  idClient: number,
  nameClient: string,
  idBarber: number,
  nameBarber: string,
  // address: Address, 
  address: string, 
  logPayment : [LogPaymentInterface],
  city:string,
  dateBeginOrder: string,
  hourStart: string,
  // hourEnd: string, /*NUevo*/
  // dateFinishOrder: string, /*NUevo*/
  services :[ServiceInterface],
  pending : boolean,
  status: boolean,
  price: number,
}
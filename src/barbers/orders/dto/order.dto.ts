/* Interfaces */
import { Address } from "../../user/interfaces/address.interface";
import { orderService } from "../interfaces/serviceOrder.interface";
/*
  The CreateOrderDTO is the object
  with the minimun info to create 
  an order
*/
export class CreateOrderDTO {
  readonly id: number;
  readonly updated: string;
  readonly idCLient:string; //mongo id
  readonly nameClient: string;
  readonly idBarber :string;
  readonly nameBarber: string;
  readonly address: Address;
  readonly service: orderService;
  readonly dateBeginOrder: string;
  readonly hourStart:string;
  readonly pending: boolean;
  readonly status : boolean;
  readonly price : number;
}





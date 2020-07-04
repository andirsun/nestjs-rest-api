/* Interfaces */
import { Address } from "../../../user/domain/interfaces/address.interface";
import { ServiceOrderRepository  } from "../interfaces/service.interface";
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
  readonly service: ServiceOrderRepository;
  readonly dateBeginOrder: string;
  readonly hourStart:string;
  readonly pending: boolean;
  readonly status : boolean;
  readonly price : number;
}





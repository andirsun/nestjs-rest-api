/* Interfaces */
import { ProductInterfaceOrder } from "../interfaces/productOrder.interface";
import { Address } from "../interfaces/address.interface";
import { PaymentMethodInterface } from "../interfaces/paymentMethod.interface";

export class CreateOrderPetsDTO{
  //readonly status : boolean;
  readonly status : string; // to define
  readonly updated : string;
  readonly idClient :string;
  readonly phoneClient : number;
  readonly nameClient : string;
  readonly idPartner : string;
  readonly namePartner : string;
  readonly commission : number;
  readonly address : Address;
  readonly dateBeginOrder : string;
  readonly hourStart : string;
  readonly products : [ProductInterfaceOrder];
  readonly totalAmount : number;
  readonly paymentMethod : PaymentMethodInterface
}
/* Interfaces */
import { Product } from "src/pets/products/interfaces/product.interface";
import { Address } from "../interfaces/address.interface";

export class CreateOrderPetsDTO{
  readonly status : boolean;
  readonly idClient : string;
  readonly nameClient : string;
  readonly idPartner : string;
  readonly namePartner : string;
  readonly address : Address;
  readonly dateBeginOrder: string;
  readonly hourStart : string;
  readonly dateFinishOrder : string;
  readonly products : [Product];
  readonly totalAmount : number;
  readonly commision : number;
}
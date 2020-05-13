/* Interfaces */
import { Product } from "src/pets/products/interfaces/product.interface";
import { Address } from "../interfaces/address.interface";

export class CreateOrderPetsDTO{
  //readonly status : boolean;
  idClient : string;
  nameClient : string;
  idPartner : string;
  namePartner : string;
  address : Address;
  dateBeginOrder: string;
  hourStart : string;
  products : [Product];
  totalAmount : number;
  commission : number;
}
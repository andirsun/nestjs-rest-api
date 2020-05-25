/* Interfaces */
import { ProductInterfaceOrder } from "../interfaces/productOrder.interface";
import { Address } from "../interfaces/address.interface";
import { PaymentMethodInterface } from "../interfaces/paymentMethod.interface";
import { ShoppingCartPetsOrderInterface } from "../interfaces/shoppingCartOrder.interface";

export class CreateOrderPetsDTO{
  //readonly status : boolean;
  readonly status : string; // to define
  readonly updated : string;
  readonly idClient :string;
  readonly phoneClient : string;
  readonly nameClient : string;
  readonly idPartner : string;
  readonly namePartner : string;
  readonly commission : number;
  //readonly address : Address;
  readonly address : string;
  readonly dateBeginOrder : string;
  readonly hourStart : string;
  readonly shoppingCart? : [ShoppingCartPetsOrderInterface]; //Used only to recieve order from frontend
  readonly products : [ProductInterfaceOrder]
  readonly totalAmount : number;
  readonly paymentMethod : PaymentMethodInterface
}
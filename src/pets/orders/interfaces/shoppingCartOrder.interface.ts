/* interfaces */
import { ProductInterfaceOrder } from "./productOrder.interface";

export interface ShoppingCartPetsOrderInterface {
  idPartner : string,
  products : [ProductInterfaceOrder],
  totalAmount : number
}
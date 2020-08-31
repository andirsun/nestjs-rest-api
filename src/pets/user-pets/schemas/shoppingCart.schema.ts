import { Schema } from "mongoose";
import { ProductPetsOrderSchema } from "src/pets/orders/schemas/productOrder.schema";
export const ShoppingCartPetsSchema = new Schema({
  idPartner : String,
  products : [ProductPetsOrderSchema],
  totalAmount : Number
})
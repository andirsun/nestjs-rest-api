import { Schema } from "mongoose";
import { ProductPetsOrderSchema } from "src/pets/orders/schemas/productOrder.schema";
export const ShoppingCartOrderPetsSchema = new Schema({
  idPartner : String,
  products : [ProductPetsOrderSchema],
  totalAmount : Number
})
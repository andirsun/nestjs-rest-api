import { Schema } from 'mongoose';

export const UserPromCodeSchema = new Schema({
  discount: Number,
  code: String,
  expirationDate: String
})
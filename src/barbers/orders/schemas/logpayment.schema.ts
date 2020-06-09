import { Schema } from 'mongoose';


export const LogPaymentSchema = new Schema({
  date : String,
  id1 : Number,
  codeQr : String,
  description : String
});
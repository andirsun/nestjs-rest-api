/* Mongoose plugins */
import { Schema } from "mongoose";
import uniqueValidator = require("mongoose-unique-validator");
/* INterfaces */
import { BarbersPaymentsInterface } from "../../domain/interfaces/payments.interface";

export const PaymentSchema = new Schema<BarbersPaymentsInterface>({
  date : String,
  type : String, //PAYMENT  | DISPERSION
  amount : Number,
  paymentId : {
    type : String,
    unique : [true,"El id de la referencia ya se uso y no es valido"]
  }, // Nequi Payment reference
  ip : String
});

PaymentSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

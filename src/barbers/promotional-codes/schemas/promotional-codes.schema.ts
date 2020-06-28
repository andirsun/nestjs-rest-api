import { Schema } from 'mongoose';

/*Adional Schemas*/
import { CodeTrackerSchema } from '../../referred-codes/schemas/code-tracker.schema';



let validCluster = {
  values: ["ADS", "EVENTS", "PRIVATE_COMPANY", "INDEPENDENT_GROUP"],
  message: "{VALUE} no es un cluser válido"
};
export const PromotionalCodeSchema =  new Schema({


  // cluster, promotor,description, currentDate, code

  promotor: {
    type: String,
    required: true,
    default: 'ADMIN'
  },
  code:{
    type: String,
    unique: true,
    required: true
  },
  generationDate:{
    type: String,
    required: true
  },
  expirationDate: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  cluster: {
    type: String,
    enum: validCluster
  },
  usedCodeTracker: [CodeTrackerSchema],
  discount: {
    type: Number,
    required:[true, "Set the discount is required"],
  }
}) 
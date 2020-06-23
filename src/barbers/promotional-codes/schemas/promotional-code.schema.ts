import { Schema } from 'mongoose';

/*Adional Schemas*/
import { CodeTrackerSchema } from './code-tracker.schema'

export const promotionalCodeSchema =  new Schema({

  promotorId: {
    type: String,
    required: true
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
  usedCodeTracker: [CodeTrackerSchema]
})
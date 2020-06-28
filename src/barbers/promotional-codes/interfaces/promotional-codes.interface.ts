/* Mongoose Dependences*/
import { Document } from 'mongoose';


/* Aditional Interfaces*/
import { CodeTrackerInterface } from '../../../../dist/barbers/promotional-codes/interfaces/code-tracker.interface';


export interface PromotionalCodeInterface  extends Document  {
  promotor : string,
  code: string
  generationDate: string,
  expirationDate: string,
  description: string,
  cluster: string,
  usedCodeTracker: [CodeTrackerInterface],
  discount: number
}
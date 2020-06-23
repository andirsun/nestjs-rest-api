/* Mongoose Dependences*/
import { Document } from 'mongoose';

/* Aditional Interfaces*/
import { CodeTrackerInterface } from './code-tracker.interface';



export interface ReferredCodeInterface  extends Document  {
  promotorId : string,
  code: string
  generationDate: string,
  usedCodeTracker: [CodeTrackerInterface]
}
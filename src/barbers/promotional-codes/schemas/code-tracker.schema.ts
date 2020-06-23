import { Schema } from 'mongoose';

export const CodeTrackerSchema = new Schema ({
  date: String,
  userId: String
})
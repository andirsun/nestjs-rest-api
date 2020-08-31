import { Document } from "mongoose";

export interface QueryRepository extends Document {
    _id : string,
    query : string,
    time: string
};
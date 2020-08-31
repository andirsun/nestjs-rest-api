import { Document } from "mongoose";

export interface Log extends Document {
    category : string,
    description : string,
    relatedID: string,
};

  
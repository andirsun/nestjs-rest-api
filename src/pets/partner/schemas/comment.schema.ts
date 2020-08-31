import { Schema } from "mongoose"


export const CommentSchema = new Schema({
    id : Number,
    date : String,
    comment : String ,
    idUser : String , 
    nameUser : String
});

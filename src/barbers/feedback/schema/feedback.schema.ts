
import { Schema } from 'mongoose';

//El Schema no lo exportamos como modelo sino como constante

const moment = require('moment-timezone');

export const FeedbackSchema = new Schema({
    updated: { 
        type: String,
        required:true,
        default :  moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm"),
    },
    idUser: {
        type: String,
        required: [true, "El id del usuario es necesario"]
    },
    nameUser: {
        type: String,
        required: [false]
    },
    feedback: {
        type: String,
        required: [true,"la descripcion es necesaria"]
    }
})
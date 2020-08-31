import { Schema } from "mongoose";



export const barberyServiceSchema = new Schema({
  
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: String,
    required:true, 
  },
  name: {
    type: String,
    required: [true, "El Nombre es necesario"]
  },
  price: {
    type: String,
    required: [true,"EL precio es necesario"]
  },
  description: {
    type: String,
    required: [true,"la descripcion es necesaria"]
  },
  urlImg: {
    type: String,
    required: [true, "La ruta de la imagen es necesaria"]
  }

});
import { Schema } from 'mongoose'; 

/*Schemas*/
import { AddressSchema } from 'src/barbers/user/schemas/address.schema';
import { LogPaymentSchema } from './logpayment.schema'


export const TempOrderSchema = new Schema({
  id: {
    type: Number,
    require: [true, "EL id es necesario"],
    default: 0
  },
  updated: { 
    type: String,
    required:true, 
  },
  idClient: {
    type: Number,
    required: [true, "El id del cliente es necesario"]
  },
  nameClient:{
    type: String,
    required:[true,"EL nombre del cliente es necesario"]
  },
  idBarber: {
    type: Number,
    required: [false]
  },
  nameBarber:{
    type: String,
    require:[false]
  },
  /*
  Temporal fix , the address in the V1.0 must be a 
  string and in the version 2.0 of create order
  must be a Addres Schema
  */
  // address: AddressSchema, 
  address: String, 

  city:{
    type: String,
    required: [true, "la ciudad es necesaria"]
  },
  dateBeginOrder: {
    type: String,
    required: [true, "La fecha de inicio del pedido es necesaria"]
  },
  hourStart: {
    type: String,
    required: [true, "La Hora de creacion es necesaria"]
  },
  // hourEnd: { /*Nuevo*/
  //   type: String,
  //   required: [false]
  // },
  // dateFinishOrder: { /*Nuevo*/
  //   type: String,
  //   required: [false]
  // },
  services :[{
    idService : Number,
    nameService :String,
    typeService : String,
    price: Number,
    quantity:Number
  }],
  pending : { 
    type : Boolean,
    required:[true, "el estado de pendiente es necesario"],
    default : true 
  },
  logPayment : [LogPaymentSchema],
  status: {
    type: Boolean,
    default: true,
    required: [false]
  },
  price:{
    type: Number,
    required:[true, "EL precio es estrictamente necesario"]
  }
})
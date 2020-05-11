/* Mongoose dependencies */
import { Document } from "mongoose";
/* Interfaces */
import { DeviceInfoInterface } from "./deviceInfo.interface";
import { BarbersPaymentsInterface } from "./payments.interface";
export interface BarberInterface extends Document {
  id : number,
  updated : string,
  balance : number,
  connected : boolean,
  name : string,
  lastName : string,
  phone : number,
  phoneToken : string,
  bio : string,
  points : number,
  stairs : number,
  numberServices : number,
  document : number ,
  birth : string,
  email : string,
  password : string,
  address : string,
  city : string,
  urlImg : string,
  role : string,
  deviceInfo :[DeviceInfoInterface] ,
  payments: [BarbersPaymentsInterface]

}

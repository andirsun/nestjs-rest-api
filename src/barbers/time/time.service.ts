import { Injectable } from "@nestjs/common";
import * as moment2 from "moment-timezone";
import { InjectModel } from "@nestjs/mongoose";
import { barberyOrder } from "../orders/interfaces/orders.interface";
import { Model } from 'mongoose';
const moment = require('moment-timezone');

@Injectable()
export class TimeService{

  constructor(@InjectModel('orders') private orders: Model<barberyOrder>){}
  
  /*
    This function takes as a parameter an hour in HH:mm:ss format and returns the received time in 
    its amount in minutes. Is used in orderDuration service.
  */
  private  durationInMinutes(difference:string) : number {
    return (moment.duration(difference)._data.hours)*60 + moment.duration(difference)._data.minutes;
    
  }
    
  /*
    This function set the service and order duration into the order docuemnt
  */

  async setDuration(orderId: string, dateBeginOrder: string, hourStart: string, dateFinishOrder: string) : Promise<barberyOrder>{

    let now = moment(dateFinishOrder);
    let thenServiceDuration = moment(hourStart);
    let thenOrderDuration = moment(dateBeginOrder);
    
    //Set difference between now and thenServiceDuration in HH:mm:ss format 
    let diferenceServiceDuration = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(thenServiceDuration,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
    //serviceDuration: time in minutes, From when the barber took the order until the barber finished it
    let serviceDuration: number = this.durationInMinutes(diferenceServiceDuration); 

    //Set difference between now and thenOrderDuration in HH:mm:ss format 
    let diferenceOrderDuration = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(thenOrderDuration,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
    //orderDuration: time in minutes, From when the user take the order until the barber finished it
    let orderDuration: number = this.durationInMinutes(diferenceOrderDuration); 

    let order = this.orders.findByIdAndUpdate(orderId, { serviceDuration : serviceDuration, orderDuration: orderDuration}, { new: true });
    return order;
  }

   /*
    This function return de current date in  HH:mm:ss format
  */
   getCurrentDate(): string{
    return moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm");
  }

}
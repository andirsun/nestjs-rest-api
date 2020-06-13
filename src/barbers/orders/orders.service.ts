/* Nest js dependencies */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* Mongoose dependencies */
import { Model } from "mongoose";
/* Interfaces */
import { barberyOrder } from "./interfaces/orders.interface";

const moment = require('moment-timezone');

@Injectable()
export class OrdersService {
  /*
    THe model to inject is the same that the model in database
    see reference https://docs.nestjs.com/techniques/mongodb
  */
  constructor(@InjectModel('orders') private readonly orders : Model<barberyOrder>){}
  /* Queries */
  /*
      This function return the all active orders
  */
  async getActiveOrders(): Promise<barberyOrder[]> {
    const ActiveOrders = await this.orders.find({status:'PENDING'});
    console.log(ActiveOrders);
    return ActiveOrders;
  }

  /*
      This function return the all active orders by city 
  */
  async getAtiveOrdersByCity(city : string): Promise<barberyOrder[]>{
    const ActiveOrders = await this.orders.find({status:'PENDING',"newAddress.city":city});
    return ActiveOrders;
  }

  /*
      This function change the order status and return the order updated
  */
  async changeOrderSTatus(orderId: string, newStatus: string): Promise<barberyOrder>{
    let order : barberyOrder ;
    //The current date and hour
    let date = moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm");
    if(newStatus == 'CANCELLED'  || newStatus == 'CONFIRMED' ){
      order =  this.orders.findByIdAndUpdate(orderId, {status : newStatus,
                    updated: date }, {new: true});
    } else if ( newStatus == 'FINISHED' )
      order =  this.orders.findByIdAndUpdate(orderId, {status : newStatus, 
              updated: date, dateFinishOrder: date}, {new: true});
    }
    return order;
  }
  /*
    PENDING DOCUMENTATION
  */

  /*
    This function takes as a parameter an hour in HH:mm:ss format and returns the received time in 
    its amount in minutes. Is used in orderDuration service.
  */
  private  durationInMinutes(difference:any) : number {
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
    
    // console.log('serviceDuration   :', serviceDuration);
    // console.log('orderDuration   :', orderDuration);

    let order = this.orders.findByIdAndUpdate(orderId, { serviceDuration : serviceDuration, orderDuration: orderDuration}, { new: true });
    return order;
  }
  
  /*
      This function insert the url image in a order document and return it updated
  */
  async addUrlImgToOrder( orderId: string, urlImg: string ) : Promise <barberyOrder>{
    return await this.orders.findByIdAndUpdate(orderId, { img : urlImg }, {new : true});
  }

}

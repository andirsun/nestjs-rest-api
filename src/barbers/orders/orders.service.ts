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
      This function return the all the users in the database
  */
  async getActiveOrders(): Promise<barberyOrder[]> {
    const ActiveOrders = await this.orders.find({status:'PENDING'});
    console.log(ActiveOrders);
    return ActiveOrders;
  }
  async getAtiveOrdersByCity(city : string): Promise<barberyOrder[]>{
    const ActiveOrders = await this.orders.find({status:'PENDING',"newAddress.city":city});
    return ActiveOrders;
  }
  async changeTempOrderSTatus(orderId: string, newStatus: string): Promise<barberyOrder>{
    let order;
    let date = moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm");
    if(newStatus != 'FINISHED'){
      order =  this.orders.findByIdAndUpdate(orderId, {status : newStatus,
                    updated: date }, {new: true});
    }else{
      order =  this.orders.findByIdAndUpdate(orderId, {status : newStatus, 
              updated: date, dateFinishOrder: date}, {new: true});
    }
    return order;
  }

  async setOrderDuration(orderId: string, dateBeginOrder: string, hourStart: string) : Promise<barberyOrder>{
    console.log('dateBeginOrder   :', dateBeginOrder);
    console.log('hourStart   :', hourStart)
    // let duration:string = moment.utc(moment(dateFinishOrder,"DD/MM/YYYY HH:mm:ss").diff(moment(hourStart,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
    let duration = moment(moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")).diff(moment(dateBeginOrder + " " + hourStart), 'minutes');
    // console.log('duration   :', duration);
    let order = this.orders.findByIdAndUpdate(orderId, { duration : duration}, { new: true });
    return order;
  }
  
  async addUrlImgToOrder( orderId: string, urlImg: string ) : Promise <barberyOrder>{
    return await this.orders.findByIdAndUpdate(orderId, { img : urlImg }, {new : true});
  }
    



}

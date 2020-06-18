/* Nest js dependencies */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* Mongoose dependencies */
import { Model } from "mongoose";
/* Interfaces */
import { barberyOrder } from "./interfaces/orders.interface";


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
      This function find the confirmmed orders that corresponding to a barber
      and return it
  */
  async getBarberActiveOrders(barberId: string) : Promise<barberyOrder[]>{
    const activeOrders = await this.orders.find({status:'CONFIRMED', idBarber: barberId});
    console.log('ACTIVE   :', activeOrders);
    return activeOrders;
  }

  /*
      This function change the order status and return the order updated
  */
  async changeOrderSTatus(orderId: string, date: string, newStatus: string, comment: string ) : Promise<barberyOrder>{
    let order : barberyOrder ;
    if(newStatus == 'CANCELLED'  || newStatus == 'CONFIRMED' ) {
      order =  await this.orders.findByIdAndUpdate(orderId, {status : newStatus,updated: date, comments: comment }, {new: true});
    } else if ( newStatus == 'FINISHED' ) {
      order =  await this.orders.findByIdAndUpdate(orderId, {status : newStatus, updated: date, dateFinishOrder: date, comments: comment }, {new: true});
    }
    return order;
  }

  /*
    This function set the service and order duration into the order document
  */
  async setFinishDuration(orderId: string, orderDuration: number, serviceDuration: number) : Promise<barberyOrder>{
    let order = this.orders.findByIdAndUpdate(orderId, { serviceDuration : serviceDuration, orderDuration: orderDuration}, { new: true });
    return order;
  }
 
   
  /*
      This function insert the url image into order document and return it updated
  */
  async addUrlImgToOrder( orderId: string, urlImg: string ) : Promise <barberyOrder>{
    return await this.orders.findByIdAndUpdate(orderId, { img : urlImg }, {new : true});
  }

}

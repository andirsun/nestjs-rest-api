/* Nest Js dependencies */
import { Injectable } from '@nestjs/common';
/* Mongoose dependdencies */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
/* Interfaces */
import { OrderPetsInterface } from './interfaces/order.interface';
import { CreateOrderPetsDTO } from './dto/order.dto';
import { OrderHistoryInterface } from './interfaces/historyOrder.interface';

import * as momentZone from 'moment-timezone';

@Injectable()
export class OrdersService {

  constructor(@InjectModel('orders') private readonly ordersModel : Model<OrderPetsInterface>){}
  /*
    This function create a new Pets order
    Revieve a createProductDto OBJECT with the data
    returns the saved object as promise
  */
  async createOrder(createOrderPetsDTO : CreateOrderPetsDTO) : Promise<OrderPetsInterface> {
    /* Create the new Order as instance */
    let newOrder = new this.ordersModel(createOrderPetsDTO);
    /* Returns the insert query */
    return await newOrder.save(); 
  }
  /*
    This order change the status of an order
    revieve an order id and Status
    Change the status and create a log
  */
 async changeOrderStatus(idOrder : string, status: string, ip : string){
    /* Build the change log to insert in db */
    var log : OrderHistoryInterface ={
      date : momentZone().tz('America/Bogota').format("YYYY-MM-DD HH:mm"),
      description : `La orden cambio de estado a ${status}`,
      relatedId : ip
    };
    /* Change the status of the order and insert a change log */
    return await this.ordersModel.findByIdAndUpdate(idOrder,{status : status, $push :{ history : log}},{new:true})
 }
}

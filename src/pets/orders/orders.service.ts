/* Nest Js dependencies */
import { Injectable } from '@nestjs/common';
/* Mongoose dependdencies */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
/* Interfaces */
import { OrderPetsInterface } from './interfaces/order.interface';
import { CreateOrderPetsDTO } from './dto/order.dto';

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
}

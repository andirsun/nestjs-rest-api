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
  constructor(@InjectModel('temporalorders') private readonly ordersModel : Model<barberyOrder>){}
  /* Queries */
  /*
      This function return the all the users in the database
  */
  async getActiveOrders(): Promise<barberyOrder[]> {
    const ActiveOrders = await this.ordersModel.find({status:true});
    console.log(ActiveOrders);
    return ActiveOrders;
  }
  async getAtiveOrdersByCity(city : string): Promise<barberyOrder[]>{
    const ActiveOrders = await this.ordersModel.find({status:true,"newAddress.city":city});
    return ActiveOrders;
  }
  async changeTempOrderSTatus(idOrder: number): Promise<barberyOrder>{
    console.log('Id Order    ', idOrder);
    const tempOrder = await this.ordersModel.findOneAndUpdate({id: idOrder,status:true},{status:false})

    const temp2 = await this.ordersModel.find();
    
    console.log('ESte es el temp ', tempOrder)    
    console.log('ESte es el temp2 ', temp2)
    
    return 
  }
}

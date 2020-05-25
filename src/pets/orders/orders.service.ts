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
import { Partner } from '../partner/interfaces/partner.interface';
import { PartnerService } from '../partner/partner.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel('orders') private readonly ordersModel : Model<OrderPetsInterface>,
    private partnerServices : PartnerService,
  
    ){}
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
    This function change the status of an order
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
  /*
    This Function fetch avaible orders for partner
    from database  
  */
  async getAvailableOrders(phonePartner : number):Promise<OrderPetsInterface[]>{
    const partner : Partner = await this.partnerServices.getPartnerByPhone(phonePartner);
    return await this.ordersModel.find({idPartner: partner._id,status:'ACTIVE'});
  }
  /*
    This Function fetch avaible orders for partner
    from database  
  */
 async getTakenOrders(phonePartner : number):Promise<OrderPetsInterface[]>{
  const partner : Partner = await this.partnerServices.getPartnerByPhone(phonePartner);
  /* This query seatrch orders with status ['PREPARING','DISPATCHED','RECIEVED','FINALIZED']  */
  return await this.ordersModel.find({idPartner: partner._id,status:{$in :['PREPARING','DISPATCHED','RECIEVED','FINALIZED']}});
}

}

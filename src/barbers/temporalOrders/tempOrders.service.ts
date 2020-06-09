import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { TempOrder } from './interfaces/tempOrders.interface'
import { Model } from 'mongoose';
const moment = require('moment-timezone');

@Injectable()
export class TempOrderService{
  constructor(@InjectModel('tempOrder') private readonly tempOrderModel: Model <TempOrder> ){}


  async changeTempOrderSTatus(idOrder: number): Promise<TempOrder>{
    console.log('Id Order    ', idOrder);
    const tempOrder = await this.tempOrderModel.findOneAndUpdate({id: idOrder,status:true},
      {status:false,updated: moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm")})

    const temp2 = await this.tempOrderModel.find();
    
    console.log('ESte es el temp ', tempOrder)    
    console.log('ESte es el temp2 ', temp2)
    
    return 
  }

 
}
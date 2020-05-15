/* Nest js dependencies */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* MOngoose dependecies */
import { Model } from 'mongoose';
/* Interfaces */
import { BarberInterface } from "./interfaces/barber.interface";
import { BarbersPaymentsInterface } from './interfaces/payments.interface';
/** Moment js Time handler module */
import * as momentZone from 'moment-timezone';
@Injectable()
export class BarberService {

  constructor(@InjectModel('barbers') private readonly barberModel : Model<BarberInterface>){}

  async getBarbersByCity(city : string): Promise<BarberInterface[]>{
    const Barbers = await this.barberModel.find({city:city});
    return Barbers;
  }
  /*
    This function create a payment log for barbers
  */
  async addPaymentLog(idBarber : string, amount : number, paymentId : string,ip:string) : Promise<BarberInterface>{
    /* Create the log to insert in Db */
    var log : BarbersPaymentsInterface = {
      amount : amount,
      date : momentZone().tz('America/Bogota').format("YYYY-MM-DD HH:mm"),
      paymentId : paymentId,
      type : "PAYMENT",
      ip
    }
    /* Insert and return the query */
    return this.barberModel.findByIdAndUpdate(idBarber,{$push : {payments: log}},{new : true});
  }
  
}

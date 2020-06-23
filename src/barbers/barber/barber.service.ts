/* Nest js dependencies */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* MOngoose dependecies */
import { Model } from 'mongoose';
/* Repositories */
import { BarberInterface } from "./interfaces/barber.interface";
import { BarbersPaymentsInterface } from './interfaces/payments.interface';
/* Dtos*/
import { CreateBarberDTO } from './dto/barber.dto';
/** Moment js Time handler module */
import * as momentZone from 'moment-timezone';

@Injectable()
export class BarberService {

  constructor(@InjectModel('barbers') private readonly barberModel : Model<BarberInterface>){}
  
  /*
    This function find all barbers at a city and return it
  */
  async getBarbersByCity(city : string): Promise<BarberInterface[]>{
    const Barbers = await this.barberModel.find({city:city});
    return Barbers;
  }
  
  /*
    This function find a barber by phone and return it
  */
  async getBarberByPhone(barberPhone : number): Promise <BarberInterface>{
    const Barbers = await this.barberModel.findOne({phone:barberPhone});
    return Barbers;
  }

  /*
    This function charge amount of money to a barber
    account balance
  */
  async makePaymentCharge(idBarber : string, amount:number): Promise<BarberInterface>{
    return this.barberModel.findByIdAndUpdate(idBarber,{$inc : {balance : amount}},{new:true});
  }

    
  /*
    This function the barber connected status 
  */
  async getBarberConnection (barberPhone : number): Promise <boolean>{
    let connected;
    const barber = await this.barberModel.findOne({phone:barberPhone});
    //If the barber does not exist, so barber is equal to null 
    if(barber == null){
      connected = null;
    }else{
      connected = barber.connected;
    };
    return connected;
  }
  
  /*
    This function return the barber status (if is a enabled account) 
  */
  async getBarberStatus (barberPhone : number): Promise <boolean>{
    let status;
    const barber = await this.barberModel.findOne({phone:barberPhone});
    //If the barber does not exist, so barber is equal to null 
    if(barber == null){
      status = null;
    }else{
      status = barber.status;
    };
    
    return status;
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

   /*
    This function create a barber in database
  */
  async createBarber(baberDTO: CreateBarberDTO): Promise <BarberInterface>{
    const barber = await new this.barberModel(baberDTO);
    return barber.save();
  }
  
  /*
    This function add points and set balance into barber docuemnt, when the order is finished. 
    return barber document.
  */
  async addBarberPoints(orderCommission: number, barberId: string) : Promise <BarberInterface>{
    const barber = this.barberModel.findByIdAndUpdate(barberId,{ $inc:{ points: 50, balance: -orderCommission }});
    return  barber
  }
  
}

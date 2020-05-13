/* Nest js dependencies */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* MOngoose dependecies */
import { Model } from 'mongoose';
/* Interfaces */
import { BarberInterface } from "./interfaces/barber.interface";
@Injectable()
export class BarberService {

  constructor(@InjectModel('barbers') private readonly barberModel : Model<BarberInterface>){}

  async getBarbersByCity(city : string): Promise<BarberInterface[]>{
    const Barbers = await this.barberModel.find({city:city});
    return Barbers;
  }
  
}

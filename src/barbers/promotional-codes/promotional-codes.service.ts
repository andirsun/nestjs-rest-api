/*Nest Dependences*/
import { Injectable } from "@nestjs/common";
/*Mongoose Dependences*/
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
/*Aditional Dependences*/
// import { PromotionalCodeInterface } from '../../../dist/barbers/promotional-codes/interfaces/promotional-code.interface';
import { PromotionalCodeInterface } from './interfaces/promotional-codes.interface';

import { PromotionalCodeDTO } from './dto/promotional-codes.dto';
import { CodeTrackerInterface } from '.././referred-codes/interfaces/code-tracker.interface';

@Injectable()
export class PromotionalCodeService{
  constructor(@InjectModel('promotionalCode') private readonly promotinalCodeModel: Model<PromotionalCodeInterface>){}

  /*
    Check into DB, if the promotional code given from user exist
  */
  async getCode(promotionalCode: string) : Promise<PromotionalCodeInterface> {
    const code = await this.promotinalCodeModel.findOne({code: promotionalCode});
    return code;
  }

  /*
    Create a new promotional code into DB
  */
  async setNewCode(newPromCode: PromotionalCodeDTO, code: string, expirationDate: string, currentDate: string): Promise<PromotionalCodeInterface>{
    const {promotor, description, cluster, discount } = newPromCode;
    let promotionalCodeDocument = new this.promotinalCodeModel({
      promotor,
      description,
      cluster, 
      discount,
      code: code,
      generationDate: currentDate,
      expirationDate: expirationDate
    })
    return promotionalCodeDocument.save()
  }

  /*
    add date and  userId into the code-tracker when a code is used by a user
  */
  async setUsedCodeTracker(promotionalCode: string, date: string, userId: string): Promise<PromotionalCodeInterface>{
    let trackedElement: CodeTrackerInterface = {date: date, userId: userId }
    const code = this.promotinalCodeModel.findOneAndUpdate({code: promotionalCode},{ $push: { usedCodeTracker: trackedElement} });
    return code;
  }
}
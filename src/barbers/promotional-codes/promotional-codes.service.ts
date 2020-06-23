/* Nest Js dependencies */
import { Injectable } from "@nestjs/common";
/* MOngoose dependencies */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
/*Interfaces*/
import { PromotionalCodeInterface } from "./interfaces/promotional-code.interface";
import { CodeTrackerInterface } from "./interfaces/code-tracker.interface";


@Injectable()
export class PromotionalCodesService {
  constructor(@InjectModel('promotionalcodes') private readonly promotionalcodesModel: Model <PromotionalCodeInterface>){}

  /*
    Check into DB, if the promotional code given from user exist
  */
  async getCode(promotionalCode: string) : Promise<boolean> {
    const code = await this.promotionalcodesModel.findOne({code: promotionalCode});
    if(code === null){
      return false;
    }
    return true;
  }

  /*
    add date and  userId into the code-tracker when a code is used by a user
  */
  async setUsedCodeTracker(promotionalCode: string, date: string, userId: string){
    let trackedElement: CodeTrackerInterface = {date: date, userId: userId }
    const code = this.promotionalcodesModel.findOneAndUpdate({code: promotionalCode},{ $push: { usedCodeTracker: trackedElement} });
    return code;
  }

  /*
    Create a new promotional code into DB
  */
  async setNewCode(userId: string, currentDate: string, code: string): Promise<PromotionalCodeInterface>{
    let promotionalCodeDocument = new this.promotionalcodesModel({
      promotorId: userId,
      code: code,
      generationDate: currentDate
    })
    return promotionalCodeDocument.save()
  }
}
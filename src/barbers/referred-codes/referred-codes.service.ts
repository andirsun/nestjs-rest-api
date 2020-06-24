/* Nest Js dependencies */
import { Injectable } from "@nestjs/common";
/* MOngoose dependencies */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
/*Interfaces*/
import { ReferredCodeInterface } from "./interfaces/referred-code.interface";
import { CodeTrackerInterface } from "./interfaces/code-tracker.interface";


@Injectable()
export class ReferredCodesService {
  constructor(@InjectModel('referredCode') private readonly referredCodeModel: Model <ReferredCodeInterface>){}

  /*
    Check into DB, if the referred code given from user exist
  */
  async getCode(referredCode: string) : Promise<boolean> {
    const code = await this.referredCodeModel.findOne({code: referredCode});
    if(code === null){
      return false;
    }
    return true;
  }

  /*
    add date and  userId into the code-tracker when a code is used by a user
  */
  async setUsedCodeTracker(referredCode: string, date: string, userId: string): Promise<ReferredCodeInterface>{
    let trackedElement: CodeTrackerInterface = {date: date, userId: userId }
    const code = this.referredCodeModel.findOneAndUpdate({code: referredCode},{ $push: { usedCodeTracker: trackedElement} });
    return code;
  }

  /*
    Create a new referred code into DB
  */
  async setNewCode(userId: string, currentDate: string, code: string): Promise<ReferredCodeInterface>{
    let referredCodeDocument = new this.referredCodeModel({
      promotorId: userId,
      code: code,
      generationDate: currentDate
    })
    return referredCodeDocument.save()
  }
}
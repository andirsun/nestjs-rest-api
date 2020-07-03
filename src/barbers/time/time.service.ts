import { Injectable } from "@nestjs/common";
/*JS Moment dependence */
const moment = require('moment-timezone');
/*Additional interfaces*/
import { UserPromCodeInterface } from "../user/interfaces/user-promcode.interface";


@Injectable()
export class TimeService{

  /*
    This function takes as a parameter an hour in HH:mm:ss format and returns the received time in 
    its amount in minutes. Is used in setDurationInMinutes function.
  */
  setDuration(difference:string) : number {
    return (moment.duration(difference)._data.hours)*60 + moment.duration(difference)._data.minutes;
  }
  
  /*
    This functions cast from date string to moment object and return it
  */
  setMomentObject(date:string) : object {
    return moment(date);
  }

  /*
    This return a date string that represents the difference between two dates (moments objects)
  */
  setDifference(now: object, then: object) : string{
    return moment.utc(moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
  }

  /*
    This function set the service and order duration into the order docuemnt
  */
  async setDurationInMinutes(newNow: string, newThen: string) : Promise<number>{
    let now : object = await this.setMomentObject(newNow);
    let then : object = await this.setMomentObject(newThen);
    let difference = await this.setDifference(now, then);
    return this.setDuration(difference)
  }

  /*
    This function set the promotional code expiration date 
  */
  setPromExpirationDate(currentDate: string, differenceInDays: number): string{
    const expirationDate: string = moment(currentDate, "YYYY-MM-DD HH:mm").add(differenceInDays,'days').format("YYYY-MM-DD HH:mm");
    return expirationDate
  }

  /*
    This function return de current date in  HH:mm:ss format
  */
  getCurrentDate(): string{
    return moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm");
  }

  /*
    check if a code is not expired
  */
  async getPromCodeExpiryConfirmation(expirationDate: string): Promise <boolean>{
    let currentDate: string = this.getCurrentDate();
    if(currentDate <= expirationDate){
      return true
    }
    return false
  }
  /*
    check in a array of codes, which code is not expired
  */
 async getExpiredCodes(codesArray: UserPromCodeInterface[]): Promise<UserPromCodeInterface[]>{
   let codes:UserPromCodeInterface[] = [];
   //Check which code has already expired and forget it
   for(let i = 0; i < codesArray.length; i++){
     let isExpired: boolean = await this.getPromCodeExpiryConfirmation(codesArray[i].expirationDate)
     //Set array with valid codes only 
     if(isExpired){
      codes.push(codesArray[i])
     }
   }
   return codes;
 }

  /*
    Get a year of a specific date
  */
  getYear(date : string): number {
    return parseInt(moment(date).year());
  }

  /*
    Get a week name of a specific date
  */
  getWeekNumber(date : string): number {
    return parseInt(moment(date).week());
  }

  /*
    Get a time (YYYY:MM:DD) with a year and week given
  */
  getTimeWithYearAndWeek(year : number, week : number): string {
    return moment().isoWeekYear(year).isoWeek(week).startOf('week').format("YYYY-MM-DD");
  }

}
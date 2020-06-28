import { Injectable } from "@nestjs/common";
const moment = require('moment-timezone');

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
    This function return de current date in  HH:mm:ss format
  */
  getCurrentDate(): string{
    return moment().tz('America/Bogota').format("YYYY-MM-DD HH:mm");
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

}
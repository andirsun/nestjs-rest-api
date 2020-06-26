import { Controller, Put, Res, Body, HttpStatus, Query } from '@nestjs/common';
import { PromotionalCodeService } from "./promotional-codes.service";
import { TimeService } from '../time/time.service';
import { PromotionalCodeDTO } from './dto/promotional-codes.dto';

@Controller('promcodes')
export class PromotionalCodeController{
  constructor(private promotionalCodeService: PromotionalCodeService,
              private timeService: TimeService){}



  /*
    This enpoint creates a new referred code
  */
 @Put('createCode')
 async createcode( @Res() res, @Body() body:PromotionalCodeDTO){
  let promCodeDocTemplate : PromotionalCodeDTO = {
    keyword : body.keyword,
    description: body.description,
    promotor: body.promotor,
    cluster:  body.cluster,
    discount: body.discount,
    durationInDays: body.durationInDays
  }
  let currentDate: string = this.timeService.getCurrentDate();
  //Set the prom code experitaion date
  let expirationDate: string = this.timeService.setPromExpirationDate(currentDate, promCodeDocTemplate.durationInDays)
  
  let timeStamp: number = new Date().getMilliseconds();
   //Set the referred code with key word + timeStamp
   let code: string = `${promCodeDocTemplate.keyword}${timeStamp}`;
   this.promotionalCodeService.setNewCode(promCodeDocTemplate, code, expirationDate, currentDate)
     .then( (code) => {
        if(!code){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content:{
              message: 'Ups! No pudimos crear tu código'
            }
          })
        }
       return res.status(HttpStatus.OK).json({
         response: 2,
         content: {
           code: code.code
         }
       })
     })
     .catch ( (err) => {
       res.status(HttpStatus.BAD_REQUEST).json({
         response: 3,
         content:{
          message: 'Ups! Ha ocurrido un error'
         }
       })
       throw new Error(err);
     })
 }

}
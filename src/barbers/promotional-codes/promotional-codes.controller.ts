import { Controller, Put, Res, Body, HttpStatus, Query, Get } from '@nestjs/common';
import { PromotionalCodeService } from "./promotional-codes.service";
import { TimeService } from '../time/application/time.service';
import { PromotionalCodeDTO } from './dto/promotional-codes.dto';


@Controller('promcodes')
export class PromotionalCodeController{
  constructor(private promotionalCodeService: PromotionalCodeService,
              private timeService: TimeService){}


  /*
    This enpoint check if a code is valid
  */              
  @Get('/validateCode')
  async validateCode(@Res() res, @Query('promCode') promCode: string){
    //Check if a code  exists
    this.promotionalCodeService.getCode(promCode)
      .then( (code) => {
        if(!code){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response:1,
            content: {
              message: 'El código que ingresaste no existe'
            }
          })
        }
        //Check if a code expirationDate is still valid
        this.timeService.getPromCodeExpiryConfirmation(code.expirationDate)
          .then( (validCode) =>{
            if(!validCode){
              return res.status(HttpStatus.BAD_REQUEST).json({
                response:1,
                content: {
                  message: 'El código que ingresaste ya venció'
                }
              })
            }
            return res.status(HttpStatus.OK).json({
              response:2,
              content: {
                discount: code.discount,
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

  /*
    This enpoint creates a new referred code
  */
 @Put('/createCode')
 async createcode( @Res() res, @Body() promotionalCodeDTO:PromotionalCodeDTO){
  let currentDate: string = this.timeService.getCurrentDate();
  //Set the prom code experitaion date
  let expirationDate: string = this.timeService.setPromExpirationDate(currentDate, promotionalCodeDTO.durationInDays)
  let timeStamp: number = new Date().getMilliseconds();
   //Set the referred code with key word + timeStamp
   let code: string = `${promotionalCodeDTO.keyword}${timeStamp}`;
   this.promotionalCodeService.setNewCode(promotionalCodeDTO, code, expirationDate, currentDate)
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
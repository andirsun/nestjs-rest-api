
/* Nest Js dependencies */
import { Controller, Injectable, Put, Res, Body, Query, HttpStatus, Get } from '@nestjs/common';
/*Service*/
import { PromotionalCodesService } from './promotional-codes.service';
/*Aditional Services*/
import { TimeService } from '../time/time.service';


/*
  This endpoint check if a given code from user is valid
*/
@Controller('promcodes')
export class PromotionalCodesController {
  constructor(private promotionalCodeService: PromotionalCodesService,
              private timeService: TimeService){}


  @Get('getCode')
  async getCode(@Res() res, @Body() body){
    let promotionalCode = body.code;
    let userId = body.userId;
    let currentDate: string = this.timeService.getCurrentDate();
    this.promotionalCodeService.getCode(promotionalCode)
      .then( (code) => {
        if(!code){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            message: 'Ups! Tu código de referido es incorrecto'
          })
        }
        this.promotionalCodeService.setUsedCodeTracker(promotionalCode, currentDate, userId)
          .then( (codeDoc) => {
            if(!codeDoc){
              return res.status(HttpStatus.BAD_REQUEST).json({
                response: 1,
                message: 'Ups! Ha ocurrido un problema'
              })
            }
            return res.status(HttpStatus.OK).json({
              response: 2,
              message: 'Código correcto'
            })  
          })
          .catch ( (err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
              response: 3,
              message: 'Ups! Ha ocurrido un error'
            })
            throw new Error(err);
          })
      })
      .catch ( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          message: 'Ups! Ha ocurrido un error'
        })
        throw new Error(err);
      })
  }

  /*
    This enpoint creates a new promotional code
  */
  @Put('createCode')
  async createcode( @Res() res, @Body() body ){
    let userId: string = body.userId;
    let userName: string = body.userName;
    let timeStamp: number = new Date().getMilliseconds();
    let currentDate: string = this.timeService.getCurrentDate();
    //Take the userName string upto the first space
    let firstName:string = userName.substr(0, userName.indexOf(' '));
    //Set the promotional code with fisrt name + timeStamp
    let code: string = `${firstName}${timeStamp}`;
    this.promotionalCodeService.setNewCode(userId, currentDate, code)
      .then( (code) => {
        if(!code){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            message: 'Ups! No pudimos crear tu código'
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
          message: 'Ups! Ha ocurrido un error'
        })
        throw new Error(err);
      })
  }

}

/* Nest Js dependencies */
import { Controller, Injectable, Put, Res, Body, Query, HttpStatus, Get } from '@nestjs/common';
/*Service*/
import { ReferredCodesService } from './referred-codes.service';
/*Aditional Services*/
import { TimeService } from '../../modules/time/application/time.service';


/*
  This endpoint check if a given code from user is valid
*/
@Controller('refcodes')
export class ReferredCodesController {
  constructor(private referredCodeService: ReferredCodesService,
              private timeService: TimeService){}


  @Get('getCode')
  async getCode(@Res() res, @Body() body){
    let referredCode = body.code;
    let userId = body.userId;
    let currentDate: string = this.timeService.getCurrentDate();
    this.referredCodeService.getCode(referredCode)
      .then( (code) => {
        if(!code){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content : {
              message: 'Ups! Tu código de referido es incorrecto'
            }
          })
        }
        this.referredCodeService.setUsedCodeTracker(referredCode, currentDate, userId)
          .then( (codeDoc) => {
            if(!codeDoc){
              return res.status(HttpStatus.BAD_REQUEST).json({
                response: 1,
                content:{
                  message: 'Ups! Ha ocurrido un problema'
                }
                
              })
            }
            return res.status(HttpStatus.OK).json({
              response: 2,
              content : {
                message: 'Código correcto'
              }
            })  
          })
          .catch ( (err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
              response: 3,
              content : {
                message: 'Ups! Ha ocurrido un error'
              }
            })
            throw new Error(err);
          })
      })
      .catch ( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content : {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      })
  }

  /*
    This enpoint creates a new referred code
  */
  @Put('createCode')
  async createcode( @Res() res, @Body() body ){
    let userId: string = body.userId;
    let userName: string = body.userName;
    let timeStamp: number = new Date().getMilliseconds();
    let currentDate: string = this.timeService.getCurrentDate();
    //Take the userName string upto the first space
    let firstName:string = userName.substr(0, userName.indexOf(' '));
    //Set the referred code with fisrt name + timeStamp
    let code: string = `${firstName}${timeStamp}`;
    this.referredCodeService.setNewCode(userId, currentDate, code)
      .then( (code) => {
        if(!code){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content :{
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
          content :{
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      })
  }

}

/*Nest js dependencies*/
import { Controller, Get, Res, Query, HttpStatus, Post, Body, Ip, UseInterceptors, UploadedFile, Put} from '@nestjs/common';
/* Services*/
import { LogBarbersService } from '../../log-barbers/log-barbers.service';
import { BarberService } from '../application/barber.service';
import { OrdersService } from '../../orders/application/orders.service';
import { FilesService } from '../../../modules/files/application/files.service';
import { UserService } from '../../user/application/user.service';
import { TimeService } from '../../../modules/time/application/time.service';

/* Dtos*/
import { PaymentBarberLogDTO } from '../domain/dto/paymentLog.dto';
import { CreateBarberDTO } from '../domain/dto/barber.dto';

/*Interceptors*/
import { FileInterceptor } from '@nestjs/platform-express';

/*Interfaces*/
import { FileInterface } from '../../../modules/files/domain/file.interface';





@Controller('barber')
export class BarberController {

  constructor(
    private barberServices : BarberService,
    private logService : LogBarbersService,
    private orderService: OrdersService,
    private filesService : FilesService,
    private userService: UserService,
    private timeService: TimeService
  ){}

  /*
    This endpoint find return a barber by phone and return his balance and points
  */
  @Get('getBarberBalance')
  async getBarberBalance(@Res() res, @Query('phoneBarber') barberPhone: number){
    this.barberServices.getBarberByPhone(barberPhone)
      .then( (barber) => {
        if(!barber){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content:{
              message: 'No existe ningún barbero con ese número de celular'
            }
          })
        }
        return res.status(HttpStatus.OK).json({
          response: 2,
          content:{
            balance : barber.balance,
            points : barber.points
          }
        })
      })
      .catch( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      })
  }

  /*
    This endpoint find return a barber by phone
  */
  @Get('getBarberByPhone')
  async getBarberByPhone(@Res() res, @Query('phoneBarber') barberPhone: number){
    this.barberServices.getBarberByPhone(barberPhone)
      .then( (barber) => {
        if(!barber){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content:{
              message: 'No existe ningún barbero con ese número de celular'
            }
          })
        }
        return res.status(HttpStatus.OK).json({
          response: 2,
          content:{
            barber
          }
        })
      })
      .catch( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      })
  }
  /*
    This endpoint return all barbers in a city
  */
  @Get('/getByCity')
  async getActiveOrdersByCity(@Res() res,@Query('city')city : string){
    this.barberServices.getBarbersByCity(city)
      .then((barbers)=>{
        return res.status(HttpStatus.OK).json({
            response: 2,
            content: {
              barbers
            }
        });
      })
      .catch((err)=>{
        res.status(HttpStatus.BAD_REQUEST).json({
            response: 3,
            content: err
        });
        throw new Error(err);
      });   
  }
  /*
    This endpoint return all confirmed orders for a barber
  */
  @Get('/checkConfirmedOrder')
  async checkBarberOrder(@Res() res, @Query('phoneBarber') phoneBarber: number){
    let barberPhone = phoneBarber;
    //Get the barber by phone
    this.barberServices.getBarberByPhone(barberPhone)
      .then( (barber) => {
        if(!barber){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content:{
              message: 'Ups!  no te encontramos en nuestra base de datos'
            }
          })
        }
        let barberId : string = barber._id.toString()
        // check if this barber is enrrolled in an order 
        this.orderService.getBarberActiveOrder(barberId)
          .then( (order) => {
            if(!order){
              return res.status(HttpStatus.BAD_REQUEST).json({
                response: 1,
                content:{
                  message: 'No tienes ordenes confirmadas'
                }
              })
            }
            return res.status(HttpStatus.OK).json({
              response: 2,
              content: order
            })
          })
          .catch( (err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
              response: 3,
              content: {
                message: 'Ups! Ha ocurrido un error'
              }
            })
            throw new Error(err);
          })
      })
      .catch( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      });
  }
  /*
    This endpoint return all finished orders for a barber
  */
  @Get('/getHistoryOrdersBarber')
  async getOrdersHistory(@Res() res, @Query('phoneBarber') phoneBarber:number){
    let barberPhone : number = phoneBarber;
    //Get barber by phone
    this.barberServices.getBarberByPhone(barberPhone)
      .then( (barber) => {
        if(!barber){
          return res.status(HttpStatus.BAD_REQUEST).json({
            respose: 1,
            content: {
              message: 'Ups!  no te encontramos en nuestra base de datos'
            }
          })
        }
        //St the barber document id
        let barberId : string = barber._id.toString()
        
        // check if this Barber have finished orders
        this.orderService.getFinishedOrdersByBarber(barberId)
          .then( (orders) => {
            if(orders.length == 0){
              return res.status(HttpStatus.BAD_REQUEST).json({
                respose: 1,
                content: {
                  message: 'Ups!  no tienes irdenes finalizadas'
                }
              })
            }
            return res.status(HttpStatus.OK).json({
              response: 2,
              content: {
                orders
              }
            })
          })
          .catch( (err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
              response: 3,
              content: {
                message: 'Ups! Ha ocurrido un error'
              }
            })
            throw new Error(err);
          })
      })
      .catch( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      });
  }
  /*
    This endpoint return all active orders for a connected barber
  */
  @Get('getAvailableOrders')
  async getAvailableOrders(@Res() res, @Query('phoneBarber') phoneBarber: number){
    let barberPhone : number = phoneBarber;
    this.barberServices.getBarberByPhone(barberPhone)
      .then( (barber) => {
        console.log(Object.keys(barber).length)
        if((Object.keys(barber).length) == 0){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1, 
            content: {
              message: 'No existe un barbero con ese número de teléfono'
            }
          })
        }
        let connected = barber.connected;
        let status = barber.status;
        let city = barber.city;
        //Ckeck if barber is connected
        if(connected){
          //Ckeck if barber have a enabled account
          if(status){
            //Get all active orders by city 
            this.orderService.getActiveOrdersByCity(city)
              .then( (orders) => {
                if(orders.length == 0){
                  return res.status(HttpStatus.BAD_REQUEST).json({
                    response: 1, 
                    content: {
                      message: 'No hay ordenes activas en tu ciudad'
                    }
                  })
                }
                return res.status(HttpStatus.OK).json({
                  response: 2, 
                  content:{
                    orders
                  }
                })
              })
              .catch( (err) => {
                res.status(HttpStatus.BAD_REQUEST).json({
                  response: 3,
                  content: {
                    message: 'Ups! Ha ocurrido un error buscando las ordenes'
                  }
                })
                throw new Error(err);
              });
          }else{
            return res.status(HttpStatus.BAD_REQUEST).json({
              response: 1, 
              content: {
                message: 'Tu cuenta esta desactivada, debes contactar con el Administrador de tu ciudad'
              }
            })
          }
        }else{
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1, 
            content: {
              message: 'Debes estar conectado para recibir ordenes'
            }
          })
        }
    })
    .catch( (err) => {
      res.status(HttpStatus.BAD_REQUEST).json({
        response: 3,
        content: {
          message: 'Ups! Ha ocurrido un error buscando al barbero'
        }
      })
      throw new Error(err);
    });
  }

  /*
    This endpoint check if the barber is connected or not
  */
  @Get('checkBarberConnection')
  async checkIfBarberConnect(@Res() res, @Query('phoneBarber') phoneBarber: number){
    let barberPhone : number = phoneBarber;
    this.barberServices.getBarberConnection(barberPhone)
      .then( (barberConnection) => {
        //Check if the barber  does not exist
        if(barberConnection == null){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1, 
            content: {
              message: 'No existe un barbero con ese número de teléfono' 
            }
          })
        }  
        if(!barberConnection){
          return res.status(HttpStatus.OK).json({
            response: 2, 
            content: {
              message: 'El barbero no esta conectado'
            }
          })
        }
        return res.status(HttpStatus.OK).json({
          response: 2, 
          content: {
            message: 'El barbero esta conectado'
          }
        })
      })
      .catch( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      });
  }
  /*
    This endpoint reverse (cancel) a order taken for a Barber 
  */
  @Post('/orders/cancell')
  async cancellOrder(@Res() res, @Body() body){
    //The current date and hour
    let now = this.timeService.getCurrentDate();
    let comment = body.comment || "Sin comentarios";
    this.orderService.changeOrderSTatus(body.idOrder, now, 'CANCELLED', comment)
      .then( (order) => {
        if(!order){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content: {
              message: 'No encontramos la orden que quieres cancelar'
            }
          })
        };
        return res.status(HttpStatus.OK).json({
          response: 2,
          content: {
            message: 'La orden fue cancelada correctamente'
          }
        });
      })
      .catch ( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          respose: 3,
          content: {
            err 
          }
        });
        /*error to sentry report*/
        throw new Error(err);
      });
  }

  /*
    This endpoint mark as finished a completed service by a barber
  */
  @Post('/orders/finish')
  @UseInterceptors(FileInterceptor('file'))
  async finishOrder(@Res() res, @Body() body, @UploadedFile() file: FileInterface){
    let orderId : string = body.idOrder;
    let comment = body.comment || "Sin comentarios";
    //The current date and hour
    let now = this.timeService.getCurrentDate();
    this.orderService.changeOrderSTatus(orderId, now, 'FINISHED', comment)
    .then( async (newOrder) => {
      if(!newOrder){
        return res.status(HttpStatus.BAD_REQUEST).json({
          response: 1,
          content: {
            message: 'No encontramos la orden que quieres finalizar'
          }
        })
      };
      //Set duration in minutes for order and service duration
      let minutesDurationOrder : number = await this.timeService.setDurationInMinutes(newOrder.dateBeginOrder, newOrder.dateFinishOrder );
      let minutesDurationService : number = await this.timeService.setDurationInMinutes(newOrder.hourStart, newOrder.dateFinishOrder);
      //Set in DOCUMENT duration in minutes for order and service duration
      this.orderService.setFinishDuration(orderId, minutesDurationOrder,minutesDurationService)
      .then( (durationOrder) => {
        let orderPrice: number = newOrder.price;
        let orderCommission: number = orderPrice * 0.30;
        let barberId: string =  newOrder.idBarber;
        //Add barber's points and set balance 
        this.barberServices.addBarberPoints(orderCommission, barberId)
        .then ( (barber) =>{
          //Add user's points 
          let idClient: string = newOrder.idClient;
          this.userService.addUserPoints(idClient,50)
          .then ( (user) =>{
            //Upload the file to Digital Ocean
            let remotePath : string = `Barbers/Orders/${orderId}/${file.originalname}`;
            this.filesService.uploadFile(remotePath,file.originalname,file.buffer,"PUBLIC")
            .then( (response : any ) => {
              //Add image remote url to order document 
              this.orderService.addUrlImgToOrder(orderId,this.filesService.getURL())
              .then( (resp) => {
                return res.status(HttpStatus.OK).json({
                  response: 2,
                  content: {
                    message : 'UPLOADED',
                    description : '¡Archivo subido exitosiamente!',
                    remoteFilename : this.filesService.getRemoteFileName(),
                    url : this.filesService.getURL(),
                    urlFull : this.filesService.getURLParams(),
                    order: durationOrder
                  }
                });
              })
              .catch ( (err) => {
                throw new Error(err);
              })
            })
            .catch( (err) => {
              res.status(HttpStatus.BAD_REQUEST).json({
                response: 3,
                content : {
                  message : 'ERROR',
                  description : '¡Ups, tuvimos un problema!',
                  error : 'FILE CORRUPTED OR NOT FOUND IN BACKEND'
                }
              });
              throw new Error(err);
            })
          })
          .catch( (err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
              respose: 3,
              content: {
                message: '¡Ups, tuvimos un problema!',
                error: err
              }
            });
            throw new Error(err);
          })
        })
        .catch( (err) => {
          res.status(HttpStatus.BAD_REQUEST).json({
            respose: 3,
            content: {
              message: '¡Ups, tuvimos un problema!',
              error: err
            }
          });
          throw new Error(err);
        })
      })
      .catch( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          respose: 3,
          content: {
            message: '¡Ups, tuvimos un problema!',
            error: err
          }
        });
        throw new Error(err);
      })
    })
    .catch ( (err) => {
      res.status(HttpStatus.BAD_REQUEST).json({
        respose: 3,
        content: err
      });
      /*error to sentry report*/
      throw new Error(err);
    })
  }

  /*
    This endpoint make a recarge of balance
  */
  @Post('/payments/chargeBalance')
  async makeNewPayment(@Res() res, @Body() body : PaymentBarberLogDTO,@Ip() ip : string){
    /* FIrst step : make the recharge */
    this.barberServices.makePaymentCharge(body.idBarber,body.amount)
      .then(resp =>{
        this.logService.log("Se recargo la cuenta del barbero",body.idBarber);
        /* Then Create A log of payment */
        this.barberServices.addPaymentLog(body.idBarber,body.amount,body.paymentId,ip)
          .then(barber =>{
            this.logService.log("Se creo un log de pago para un barbero",body.idBarber);
            return res.status(HttpStatus.OK).json({
              response: 2,
              content: {
                message : "Genial!, tu cuenta se recargo correctamente",
                balance : barber.balance,
                payments : barber.payments
              }
            });
          })
          .catch(err=> {
            throw new Error(err);
          });
      })
      .catch(err=> {
        throw new Error(err);
      }); 
  }

  /*
    This endpoint creates a new Barber
  */
 @Put('/createBarber')
 async createBarber(@Res() res, @Body() createBarberDTO :CreateBarberDTO){
   this.barberServices.createBarber(createBarberDTO)
     .then(( newBarber ) => {
       return res.status(HttpStatus.OK).json({
         respose: 1,
         content:{ 
           newBarber 
         }
       });
     })
     .catch(( err ) => {
       /*Handle info to send frontend*/
       res.status(HttpStatus.BAD_REQUEST).json({
         respose: 3,
         content: err
       });
       /*error to sentry report*/
       throw new Error(err);
     })
 }

}


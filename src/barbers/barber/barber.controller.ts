/*Nest js dependencies*/
import { Controller, Get, Res, Query, HttpStatus, Post, Body, Ip, UseInterceptors, UploadedFile } from '@nestjs/common';
/* Services*/
import { LogBarbersService } from '../log-barbers/log-barbers.service';
import { BarberService } from './barber.service';
import { OrdersService } from '../orders/orders.service';
import { FilesService } from '../../modules/files/files.service';
import { UserService } from '../user/user.service';

/* Dtos*/
import { PaymentBarberLogDTO } from './dto/paymentLog.dto';
import { CreateBarberDTO } from './dto/barber.dto';

/*Interceptors*/
import { FileInterceptor } from '@nestjs/platform-express';

/*Interfaces*/
import { FileInterface } from '../../modules/files/file.interface';




@Controller('barber')
export class BarberController {

  constructor(
		private barberServices : BarberService,
    private logService : LogBarbersService,
    private orderService: OrdersService,
    private filesService : FilesService,
    private userService: UserService
  ){}
  
	@Get('/getByCity')
	async getActiveOrdersByCity(@Res() res,@Query('city')city : string){
		await this.barberServices.getBarbersByCity(city)
				.then((barbers)=>{
						console.log("Llegue positivo");
						return res.status(HttpStatus.OK).json({
								response: 2,
								content: {
                  barbers
                }
						});
				})
				.catch((err)=>{
						console.log("llegue negativo");
						throw new Error(err);
						// return res.status(HttpStatus.BAD_REQUEST).json({
						// 		response: 3,
						// 		content: err
						// });
				});   
  }

  /*
		This endpoint reverse (cancel) a order taken for a Barber 
  */
  
  @Post('/orders/cancell')
  async cancellOrder(@Res() res, @Body() body){
    this.orderService.changeOrderSTatus(body.idOrder, 'CANCELLED')
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
          content: err
        });
        /*error to sentry report*/
        throw new Error(err);
      })
  }

  /*
    This endpoint mark as finished a completed service by a barber
  */

  @Post('/orders/finish')
  @UseInterceptors(FileInterceptor('file'))
  async finishOrder(@Res() res, @Body() body, @UploadedFile() file: FileInterface){
    let orderId : string = body.idOrder;
    this.orderService.changeOrderSTatus(orderId, 'FINISHED')
    .then( (newOrder) => {
      if(!newOrder){
        return res.status(HttpStatus.BAD_REQUEST).json({
          response: 1,
          content: {
            message: 'No encontramos la orden que quieres finalizar'
          }
        })
      };
      let dateBeginOrder = newOrder.dateBeginOrder;
      let hourStart = newOrder.hourStart;
      let dateFinishOrder = newOrder.dateFinishOrder
      //Set duration time 
      this.orderService.setDuration(orderId, dateBeginOrder, hourStart, dateFinishOrder)
      .then( (response) => {
        let orderPrice: number = newOrder.price;
        let orderCommission: number = orderPrice * 0.30;
        let barberId: string =  newOrder.idBarber;
        //Add barber's points and set balance 
        this.barberServices.addBarberPoints(orderCommission, barberId)
        .then ( (barber) =>{
          //Add user's points 
          let idClient: string = newOrder.idClient;
          this.userService.addUserPoints(idClient)
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
                    order
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
		This endpoint creates a new Barber
  */
  @Post('/createBarber')
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
}


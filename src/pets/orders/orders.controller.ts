/* Nest js dependencies */
import { Controller, Get, Res, HttpStatus, Body, Post, Put, Query, Ip, forwardRef, Inject } from '@nestjs/common';
/* Services */
import { LogPetsService } from '../log-pets/log-pets.service';
import { OrdersService } from 'src/pets/orders/orders.service';
/* Interfaces */
import { OrderPetsInterface } from './interfaces/order.interface';
/* Dtos */
import { CreateOrderPetsDTO } from './dto/order.dto';
/* Services */
import { UserPetsService } from '../user-pets/user-pets.service';
import { PartnerService } from '../partner/partner.service';
import { TwilioService } from 'src/modules/twilio/application/twilio.service';
/* Time zone handler plugin */
import * as momentZone from 'moment-timezone';
import { OrderChangeDTO } from './dto/changeOrder.dto';
@Controller('orders-pets')
export class OrdersController {

  constructor(
    /* Own Service */
    private orderService : OrdersService,
    /* External services from other modules */
    private partnerService : PartnerService,
    private logService: LogPetsService,
    private userPetsService : UserPetsService,
    private twilioService : TwilioService
  ){}
  
  /*
    Endpoint to get available orders with a phone number of partner
  */
  @Get('/getAvailableOrders')
  async getAvailableOrders(@Res() res,@Query('phone')phone :number ){
    this.orderService.getAvailableOrders(phone)
      .then(orders=>{
        return res.status(HttpStatus.OK).json({
          response: 2,
          content:{
            orders
          }
        });
      })
      .catch(err=>{
        /* Send response */
        res.status(HttpStatus.OK).json({
          response: 1,
          content:{
            err
          }
        });
        /* Send Error to Sentry report */
        throw new Error(err);
      })
  }
  /*
    Endpoint to get available orders with a phone number of partner
  */
  @Get('/getTakenOrders')
  async getTakenOrders(@Res() res,@Query('phone')phone :number ){
    this.orderService.getTakenOrders(phone)
      .then(orders=>{
        return res.status(HttpStatus.OK).json({
          response: 2,
          content:{
            orders
          }
        });
      })
      .catch(err=>{
        /* Send response */
        res.status(HttpStatus.OK).json({
          response: 1,
          content:{
            err
          }
        });
        /* Send Error to Sentry report */
        throw new Error(err);
      })
  }
  /*
   Get user current order
  */
  @Get('users/getCurrentOrders')
	async getUserCurrentOrders(@Res() res, @Query('email') email : string ){
		this.orderService.getUserCurrentOrders(email)
			.then(orders =>{
        /* If the user doesnt have any orders */
        if(!orders.length){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content:{
              message: "EL usuario no tiene ordenes en curso"
            }
          });  
        }else{
          return res.status(HttpStatus.OK).json({
            response: 2,
            content:{
              orders
            }
          });

        }
			})
			.catch(err=>{
				res.status(HttpStatus.BAD_REQUEST).json({
					response: 1,
					content:{
						message: "Ocurrio un error"
					}
				});
				throw new Error(err);
			})
	}
  /*
    This function Create a new Order
    recieve a bofy with Structure of OrderPetsInterface
  */
  @Post('/newOrder')
  async createNewOrder(@Res() res,@Body() order : CreateOrderPetsDTO){
    /* Search the Info and build the order */
    this.userPetsService.checkUserByEmail(order.emailClient)
      .then(user=>{
        /* email provided from frontend */
        let phoneUser:string ="";
        /* Check if user have a define phone or its the same email */
        if(user.email == user.phone){
          phoneUser = order.phoneClient
        }else{
          phoneUser = user.phone
        }
        /* Create Every order for every partner in the shopping cart */
        order.shoppingCart.forEach((orderByPartner,index) => {
          this.partnerService.getPartnerById(orderByPartner.idPartner)
            .then(partner=>{
              //console.log("PARTNER NUMERO",index,partner);
              /*Build the CreateOrderpets DTO */
              let newOrder : CreateOrderPetsDTO ={
                status : "ACTIVE",
                updated :  momentZone().tz('America/Bogota').format("YYYY-MM-DD"),
                idClient : user._id,
                phoneClient : phoneUser,
                nameClient : user.name,
                idPartner : partner._id,
                emailClient : order.emailClient,
                namePartner : partner.businessName,
                commission : 10,
                address : order.address,
                dateBeginOrder :  momentZone().tz('America/Bogota').format("YYYY-MM-DD"),
                hourStart :  momentZone().tz('America/Bogota').format("HH:mm"),
                //shoppingCart : orderByPartner.products,
                products : orderByPartner.products,
                totalAmount : orderByPartner.totalAmount,
                paymentMethod : order.paymentMethod
              };
              //console.log(newOrder);
              /* Use the orders services to create the order */
              this.orderService.createOrder(newOrder)
                .then(order=>{
                  this.logService.log("Se creo una nueva orden",order._id);
                })
                .catch(err=>{
                  return new Error(err)
                });

            })
            .catch(err=>{
              /* Send response */
              res.status(HttpStatus.OK).json({
                response: 1,
                content:{
                  err
                }
              });
              /* Send Error to Sentry report */
              throw new Error(err);
            });
        });

        /* 
          If after map function the code pass here
          Means that all orders create Correctly
        */
        return res.status(HttpStatus.OK).json({
          response: 2,
          content:{
            message : "Genial, se creo la orden",
          }
        });
      })
      .catch(err=>{
          /* Send response */
          res.status(HttpStatus.OK).json({
          response: 1,
          content:{
            err
          }
        });
        /* Send Error to Sentry report */
        throw new Error(err);
      })    
  }
  
  /*
    This function Modify the state of order
  */
	@Put('/takeOrder')
	async takeOrder(@Res() res,@Ip() ip : string,@Body() body : OrderChangeDTO){
		this.orderService.changeOrderStatus(body.idOrder,body.status, ip)
			.then(order =>{
				this.logService.log("Se cambio el estado de una orden", body.idOrder);
				/* Notify to CLient about the order taked */
				this.twilioService.sendSMSMessage(order.phoneClient,`Tu order ha sido tomada por la tienda ${order.namePartner}`,57)
					.then((message)=>{
						this.logService.log(`Se en envio un mensaje de twilio exitosamente al numero ${order.phoneClient}`,message.sid)
					})
					.catch((err)=>{
						this.logService.error(`Ocurrio un error al tratar de enviar el mensaje ${order.phoneClient} `,"none");
						/* Interceptor send to sentry service */
						throw new Error(err);
					});
				return res.status(HttpStatus.OK).json({
					response: 2,
					content:{
						message : "Genial, se modifico el estado de la orden",
						order
					}
				});
			})
			.catch(err=>{
				/* Send response to front */
				res.status(HttpStatus.BAD_REQUEST).json({
					response: 1,
					content:{
						message : "Ups, ocurrio un error al tomar la orden",
						err
					}
				});
				/* Send response to sentry report */
				throw new Error(err);
			})

	}
  /*
    This function Modify the state of order
  */
  @Put('/changeStatus')
  async changeOrderStatus(@Res() res,@Ip() ip : string,@Body() body : OrderChangeDTO){
   this.orderService.changeOrderStatus(body.idOrder,body.status, ip)
    .then(order =>{
      this.logService.log("Se cambio el estado de una orden", body.idOrder);
      return res.status(HttpStatus.OK).json({
        response: 2,
        content:{
          message : "Genial, se modifico el estado de la orden",
          order
        }
      });
    })
    .catch(err=>{
      throw new Error(err);
    })

  }
}

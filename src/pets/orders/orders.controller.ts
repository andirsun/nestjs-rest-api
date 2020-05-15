/* Nest js dependencies */
import { Controller, Get, Res, HttpStatus, Body, Post, Put, Query, Ip } from '@nestjs/common';
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
/* Time zone handler plugin */
import * as momentZone from 'moment-timezone';
import { OrderChangeDTO } from './dto/changeOrder.dto';
@Controller('orders-pets')
export class OrdersController {

  constructor(
    private logService: LogPetsService,
    private orderService : OrdersService,
    private userPetsService : UserPetsService,
    private partnerService : PartnerService
    //private productServices : ProductsModule
  ){}
  
  /*
    This function Create a new Order
    recieve a bofy with Structure of OrderPetsInterface
  */
  @Post('/newOrder')
	async createNewOrder(@Res() res,@Body() order : OrderPetsInterface){
    /* Search the Info and build the order */
    this.userPetsService.getUser(order.phoneClient)
      .then(user=>{
        
        this.partnerService.getPartnerById(order.idPartner)
          .then(partner=>{

            /*Build the CreateOrderpets DTO */
            let newOrder : CreateOrderPetsDTO ={
              status : "ACTIVE",
              updated :  momentZone().tz('America/Bogota').format("YYYY-MM-DD"),
              idClient : user._id,
              phoneClient : user.phone,
              nameClient : user.name,
              idPartner : partner._id,
              namePartner : partner.businessName,
              commission : 10,
              address : order.address,
              dateBeginOrder :  momentZone().tz('America/Bogota').format("YYYY-MM-DD"),
              hourStart :  momentZone().tz('America/Bogota').format("HH:mm"),
              products : order.products,
              totalAmount : order.totalAmount,
              paymentMethod : order.paymentMethod
            };
            /* Use the orders services to create the order */
            this.orderService.createOrder(newOrder)
              .then(order=>{
                this.logService.log("Se creo una nueva orden",order._id);
                return res.status(HttpStatus.OK).json({
                  response: 2,
                  content:{
                    message : "Genial, se creo tu orden correctamente",
                    order
                  }
                });
              })
              .catch(err=>{
                throw new Error(err)
                return res.status(HttpStatus.OK).json({
                  response: 1,
                  content:{
                    err
                  }
                });
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

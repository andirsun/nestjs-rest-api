/* Nest js dependencies */
import { Controller, Get, Res, HttpStatus, Body, Post } from '@nestjs/common';
/* Services */
import { LogPetsService } from '../log-pets/log-pets.service';
import { OrdersService } from 'src/pets/orders/orders.service';
/* Interfaces */
import { OrderPetsInterface } from './interfaces/order.interface';
import { UserPets } from '../user-pets/interfaces/user-pets.interfaces';
/* Dtos */
import { CreateOrderPetsDTO } from './dto/order.dto';
/* Services */
import { UserPetsService } from '../user-pets/user-pets.service';
import { ProductsModule } from '../products/products.module';

@Controller('orders-pets')
export class OrdersController {

  constructor(
    private logService: LogPetsService,
    private orderService : OrdersService,
    private userPetsService : UserPetsService,
    //private productServices : ProductsModule
  ){}

  @Post('/newOrder')
	async createNewOrder(@Res() res,@Body() order : OrderPetsInterface){
    /* Search the Info and build the order */
    let user : UserPets;
    this.userPetsService.getUser(order.phoneClient)
      .then(user=>{
        user = user;
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
    console.log(user);
    // this.orderService.createOrder()
    //   .then(order =>{
    //     /* Log register */
    //     this.logService.log("Nueva orden creada",order._id)
    //     /* Send response */
    //     return res.status(HttpStatus.OK).json({
    //       response: 2,
    //       content:{
    //         order
    //       }
    //     });

    //   })
    //   .catch(err =>{
    //     /* Send response */
    //     res.status(HttpStatus.OK).json({
    //       response: 1,
    //       content:{
    //         err
    //       }
    //     });
    //     /* Send Error to Sentry report */
    //     throw new Error(err);
    //   });
       
	}
}

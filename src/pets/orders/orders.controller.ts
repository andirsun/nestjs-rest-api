import { Controller, Get, Res, HttpStatus } from '@nestjs/common';

@Controller('orders-pets')
export class OrdersController {

  constructor(){}

  @Get('/activeOrders')
	async getActiveOrders(@Res() res){
    return res.status(HttpStatus.OK).json({
      response: 2,
      content: "asd"
    });   
	}
}

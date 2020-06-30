/* Nest Js dependencies */
import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
/*
    Data Onjects Transfer are all the interfaces to transfer betwen this class en requests
*/
import { CreateOrderDTO } from "./dto/order.dto";
/* Services */
import { OrdersService } from './orders.service';


@Controller('orders-barbers')
export class OrdersController {

  constructor(
    private orderService : OrdersService
  ){}

  @Get('/activeOrders')
	async getActiveOrders(@Res() res){
		await this.orderService.getActiveOrders()
			.then((orders)=>{
				return res.status(HttpStatus.OK).json({
					response: 2,
					content: orders
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
	@Get('/activeOrdersByCity')
	async getActiveOrdersByCity(@Res() res,@Query('city')city : string){
		await this.orderService.getActiveOrdersByCity(city)
			.then((orders)=>{
				return res.status(HttpStatus.OK).json({
					response: 2,
					content: {
						orders
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


}

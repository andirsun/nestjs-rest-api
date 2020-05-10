/* Nest Js dependencies */
import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
/*
    Data Onjects Transfer are all the interfaces to transfer betwen this class en requests
*/
import { CreateOrderDTO } from "./dto/order.dto";
/* Services */
import { OrdersService } from './orders.service';


@Controller('orders')
export class OrdersController {

  constructor(
    private orderService : OrdersService
  ){}

  @Get('/activeOrders')
	async getActiveOrders(@Res() res){
			await this.orderService.getActiveOrders()
					.then((orders)=>{
							console.log("Llegue positivo");
							return res.status(HttpStatus.OK).json({
									response: 2,
									content: orders
							});
					})
					.catch((err)=>{
							console.log("llegue negativo");
							return res.status(HttpStatus.BAD_REQUEST).json({
									response: 3,
									content: err
							});
					});   
	}


}

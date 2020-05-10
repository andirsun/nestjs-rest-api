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

}

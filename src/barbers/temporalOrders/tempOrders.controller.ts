import { Controller, Inject } from '@nestjs/common';
import { TempOrderService } from './tempOrders.service';
import { Model } from 'mongoose';

@Controller()
export class TempOrderController {
  constructor(private tempOrderService: TempOrderService){}
}
import { Module } from '@nestjs/common';
import { TempOrderController } from './tempOrders.controller';
import { TempOrderService } from './tempOrders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { TempOrderSchema } from './schema/tempOrder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'tempOrder', schema: TempOrderSchema }
    ],'BarbersMongoDb'),
  ],
  controllers: [ TempOrderController],
  providers: [ TempOrderService],
  exports: [ TempOrderService ]
})

export class TemporalOrdersModule{}
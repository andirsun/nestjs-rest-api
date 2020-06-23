/* Nest Js dependencies */
import { Module } from '@nestjs/common';
/* MOngoose dependencies */
import { MongooseModule } from '@nestjs/mongoose';
/* Shchema */
import { promotionalCodeSchema } from './schemas/promotional-code.schema';
/* Service */
import { PromotionalCodesService } from './promotional-codes.service';
/* Controllers */
import { PromotionalCodesController } from './promotional-codes.controller';
/*Aditional Modules*/ 
import { TimeModule } from '../time/time.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'promotionalcodes', schema: promotionalCodeSchema}
    ], 'BarbersMongoDb'),
    TimeModule
  ],
  providers: [PromotionalCodesService],
  controllers: [PromotionalCodesController]
})

export class PromotionalCodesModule{}
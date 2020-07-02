/* Nest Js dependencies */
import { Module } from '@nestjs/common';
/* MOngoose dependencies */
import { MongooseModule } from '@nestjs/mongoose';
/* Shchema */
import { ReferredCodeSchema } from './schemas/referred-code.schema';
/* Service */
import { ReferredCodesService } from './referred-codes.service';
/* Controllers */
import { ReferredCodesController } from './referred-codes.controller';
/*Aditional Modules*/ 
import { TimeModule } from '../time/time.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'referredCode', schema: ReferredCodeSchema}
    ], 'BarbersMongoDb'),
    TimeModule
  ],
  providers: [ReferredCodesService],
  controllers: [ReferredCodesController]
})

export class ReferredCodesModule{}
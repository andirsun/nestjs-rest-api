import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionalCodeSchema } from "./schemas/promotional-codes.schema";
import { PromotionalCodeService } from "./promotional-codes.service";
import { PromotionalCodeController } from "./promotional-codes.controller";
import { TimeModule } from '../time/time.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'promotionalCode', schema: PromotionalCodeSchema}
    ], 'BarbersMongoDb'),
    TimeModule
  ],
  providers:[PromotionalCodeService],
  controllers: [PromotionalCodeController]
})

export class PromotionalCodesModule{}
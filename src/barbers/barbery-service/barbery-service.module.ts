import { Module } from '@nestjs/common';
import { BarberyServiceService } from './barbery-service.service';

@Module({
  providers: [BarberyServiceService]
})
export class BarberyServiceModule {}

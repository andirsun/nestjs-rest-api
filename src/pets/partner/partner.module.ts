import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';

@Module({
  providers: [PartnerService],
  controllers: [PartnerController]
})
export class PartnerModule {}

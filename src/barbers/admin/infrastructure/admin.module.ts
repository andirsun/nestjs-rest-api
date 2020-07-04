// Nest dependencies
import { Module } from '@nestjs/common';
// services
import { AdminService } from '../application/admin.service';
// Controllers
import { AdminController } from './admin.controller';
// Modules
import { UserModule } from '../../user/infrastructure/user.module';
import { TimeModule } from '../../time/infrastructure/time.module';
import { OrdersBarbersModule } from 'src/barbers/orders/infrastructure/orders.module';

@Module({
  imports : [
    UserModule,
    TimeModule,
    OrdersBarbersModule
  ],
  providers: [AdminService],
  controllers: [AdminController]
  
})
export class AdminBarbersModule {}

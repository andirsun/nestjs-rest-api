// Nest dependencies
import { Module } from '@nestjs/common';
// services
import { AdminService } from '../application/admin.service';
// Controllers
import { AdminController } from './admin.controller';
// Modules
import { UserModule } from '../../user/user.module';
import { TimeModule } from '../../time/time.module';

@Module({
  imports : [
    UserModule,
    TimeModule
  ],
  providers: [AdminService],
  controllers: [AdminController]
  
})
export class AdminBarbersModule {}

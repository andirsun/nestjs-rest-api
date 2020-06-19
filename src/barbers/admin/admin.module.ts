// Nest dependencies
import { Module } from '@nestjs/common';
// services
import { AdminService } from './admin.service';
// Controllers
import { AdminController } from './admin.controller';
// Modules
import { UserModule } from '../user/user.module';

@Module({
  imports : [UserModule],
  providers: [AdminService],
  controllers: [AdminController]
  
})
export class AdminBarbersModule {}

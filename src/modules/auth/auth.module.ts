import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PartnerModule } from 'src/pets/partner/partner.module';
import { JwtStrategy } from './strategies/jwt.strategy';
require('dotenv').config()
let secretKey = "";
if(process.env.ENVIROMENT == 'local' || process.env.ENVIROMENT =='dev' ){
  secretKey = process.env.JWT_KEY_TEST || "";
}else{
  secretKey = process.env.JWT_KEY_TEST || "";

}
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret : secretKey,
      signOptions: {
        expiresIn: 3600
      }
    }),
    PartnerModule
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}

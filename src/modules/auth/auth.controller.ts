import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { LoginPartnerDto } from "src/pets/partner/dto/login-partner.dto";
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {

  }

  @Post('/loginPartner') 
  async login(@Body() loginPartnerDto: LoginPartnerDto){
      return await this.authService.validatePartnerByPassword(loginPartnerDto);
  }
}

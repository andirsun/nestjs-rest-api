import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { LoginPartnerDto } from "src/pets/partner/dto/login-partner.dto";
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {

  }
  /*
    This login method is only for partner
    the function returns a JWT valid for 1 hour 
    the front must to save the token and put in the
    petitions headers
  */
  @Post('/loginPartner') 
  async login(@Body() loginPartnerDto: LoginPartnerDto){
      return await this.authService.validatePartnerByPassword(loginPartnerDto);
  }
}

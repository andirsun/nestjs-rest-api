import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginPartnerDto } from "src/pets/partner/dto/login-partner.dto";
import { PartnerService } from "src/pets/partner/partner.service";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { Partner } from 'src/pets/partner/interfaces/partner.interface';
@Injectable()
export class AuthService {

  constructor(private partnerService: PartnerService, private jwtService: JwtService){

  }

  async validatePartnerByPassword(loginAttempt: LoginPartnerDto) {

    // This will be used for the initial login
    let userToAttempt = await this.partnerService.getPartner(loginAttempt.phone);
    
    return new Promise((resolve) => {

        // Check the supplied password against the hash stored for this email address
        this.partnerService.checkPassword(userToAttempt,loginAttempt.password)
          .then((isMatch)=>{
            // If there is a successful match, generate a JWT for the user
            resolve(this.createJwtPayloadPartner(userToAttempt));
          })
          .catch((err) => { throw new UnauthorizedException()});
    }
    );

}

  async validateUserByJwt(payload: JwtPayload) { 
    // This will be used when the user has already logged in and has a JWT
    let user = await this.partnerService.getPartner(payload.phone);

    if(user){
        return this.createJwtPayloadPartner(user);
    } else {
        throw new UnauthorizedException();
    }

  }

  createJwtPayloadPartner(user : Partner){

    let data: JwtPayload = {
        phone: user.phone
    };

    let jwt = this.jwtService.sign(data);

    return {
        expiresIn: 3600,
        token: jwt            
    }

  }
}

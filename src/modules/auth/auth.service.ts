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
  /*
    This function check if the user credentials are okey 
    and sign his credential to return jwt
  */
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
  /*
    This function read a jwt payload and check if 
    is valid
  */
  async validateUserByJwt(payload: JwtPayload) { 
    // This will be used when the user has already logged in and has a JWT
    let user = await this.partnerService.getPartner(payload.phone);
    if(user){
        return this.createJwtPayloadPartner(user);
    } else {
        throw new UnauthorizedException();
    }
  }

  /*
    This function create a JWT 
    recieve a partner interface and
    returns a answer with jwt
  */
  createJwtPayloadPartner(user : Partner){
    /* Data to sign with jwt service */
    let data: JwtPayload = {
        phone: user.phone
    };
    /* sign the data */
    let jwt = this.jwtService.sign(data);
    return {
        response : 2,
        content : {
          expiresIn: 18000,
          token: jwt            

        }
    }

  }
}

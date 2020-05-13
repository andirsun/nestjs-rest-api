/*
		The functionality of this file is validate
		every time a request come to server and check
		the validity of the JWT, and if its valid
		then answer to the request, if not valid
		return a unauthorized
*/
/* Nest js importations */
import { Injectable, UnauthorizedException } from '@nestjs/common';
/* Passport nest module */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
/* Service */
import { AuthService } from '../auth.service';
/* Nest js */
import { JwtPayload } from '../interfaces/jwt-payload.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private authService: AuthService){
    
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration : false,
      secretOrKey : 'temporalFix' 
		});

  }

  async validate(payload: JwtPayload){
      const user = await this.authService.validateUserByJwt(payload);
      if(!user){
          throw new UnauthorizedException();
      }
      return user;

  }

}
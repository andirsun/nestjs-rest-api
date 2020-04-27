/* Nest js Dependencies */
import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
/** DTOs */
import { CreateUserPetsDTO } from "./dto/user-pets.dto";
/* Services */
import { UserPetsService } from "./user-pets.service";
import { LogPetsService } from "../log-pets/log-pets.service";

@Controller('user-pets')
export class UserPetsController {

    constructor(
        private userPetsServie : UserPetsService,
        private logService : LogPetsService
    ){}

    @Post('/createUserPets')
    async createUser(@Res() res, @Body() createUserDTO : CreateUserPetsDTO){
        
        /** FUncion logic */
    }
}

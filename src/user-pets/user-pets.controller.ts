import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';

/** Personal Importations */
import { CreateUserPetsDTO } from "./dto/user-pets.dto";
import { UserPetsService } from "./user-pets.service";
import { LogPetsService } from "../logs/log-pets/log-pets.service";

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

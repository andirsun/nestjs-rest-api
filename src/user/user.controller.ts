//Personal Libraries
import {  } from "bcrypt";
import { Moment } from "moment-timezone";
const _ = require("underscore");

import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
//Data Onjects Transfer are all the interfaces to transfer betwen this class en requests
import { CreateUserDTO } from "./dto/user.dto";
import { UserService } from "./user.service";
import { Log } from "../logs/log-barbers/interfaces/logBarbers.interface";
import { LogBarbersService } from "../logs/log-barbers/log-barbers.service";
import { CreateLogBarbersDTO } from "../logs/log-barbers/dto/logBarbers.dto";

@Controller('user')
export class UserController {

    constructor(private userService : UserService, private logService : LogBarbersService){}
    //This endopoint can be accesed with url/user/createNewUser
    @Post('/createUser')
    async createUser(@Res() res, @Body() createUserDTO : CreateUserDTO){
        await this.userService.createUser(createUserDTO)
            .then((user)=>{
                console.log("Llegue positivo");
                return res.status(HttpStatus.OK).json({
                    response: 2,
                    content: user
                });
            })
            .catch((err)=>{
                console.log("llegue negativo");
                return res.status(HttpStatus.BAD_REQUEST).json({
                    response: 3,
                    content: err
                });
            })   
    }
    
    @Get('/createLog')
    getHello()/*: string*/ { 
        //let log2 : CreateLogBarbersDTO;
        this.logService.log("mensaje test");
        //return this.appService.getHello();
      }
    
    //recibir objetos por parametro
    // deleteUser(@Res res , @Query('objetoPorurl') objeto){

    // }
}

import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
//Data Onjects Transfer are all the interfaces to transfer betwen this class en requests
import { CreateUserDTO } from "./dto/user.dto";
import { UserService } from "./user.service";
@Controller('user')
export class UserController {

    constructor(private userService : UserService){}
    //This endopoint can be accesed with url/user/createNewUser
    @Post('/createUser')
    async createUser(@Res() res, @Body() createUserDTO : CreateUserDTO){
        await this.userService.createUser(createUserDTO)
            .then((user)=>{
                return res.status(HttpStatus.OK).json({
                    response: 2,
                    content: user
                });
            })
            .catch((err)=>{
                return res.status(HttpStatus.BAD_REQUEST).json({
                    response: 3,
                    content: err
                });
            })   
    }
    //recibir objetos por parametro
    // deleteUser(@Res res , @Query('objetoPorurl') objeto){

    // }
}

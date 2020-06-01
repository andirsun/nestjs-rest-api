/* Nest Js dependencies */
import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
/*
    Data Onjects Transfer are all the interfaces to transfer betwen this class en requests
*/
import { CreateUserDTO } from "./dto/user.dto";
/* Services */
import { UserService } from "./user.service";
import { LogBarbersService } from "../log-barbers/log-barbers.service";


@Controller('user')
export class UserController {

	constructor(
							private userService : UserService,
							private logService : LogBarbersService
							){}

	/*
		This endpoint return all users
	*/
	@Get('/barbers/getAll')
	async getUsers(@Res() res){
		await this.userService.getUsers()
			.then(users=>{
				this.logService.log("Se consultaron los usuarios","none");
				return res.status(HttpStatus.OK).json({
					response: 2,
					content:{
						users
					}
				});
			})
			.catch(err=>{
				/* Local log */
				this.logService.error("Error al consultar los usuarios","none");
				/* Sentry report */
				throw new Error(err);
			})
	}
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
					});   
	}


	
}

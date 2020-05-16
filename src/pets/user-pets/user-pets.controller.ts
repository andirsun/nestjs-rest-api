/* Nest js Dependencies */
import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
/** DTOs */
import { CreateUserPetsDTO } from "./dto/user-pets.dto";
/* Services */
import { UserPetsService } from "./user-pets.service";
import { LogPetsService } from "../log-pets/log-pets.service";
import { ProductsService } from '../products/products.service';

@Controller('user-pets')
export class UserPetsController {

	constructor(
		private userPetsServie : UserPetsService,
		private logService : LogPetsService,
		private productService : ProductsService
	){}

	@Post('/new')
	async createUser(@Res() res, @Body() createUserDTO : CreateUserPetsDTO){
		this.userPetsServie.createUser(createUserDTO)
			.then(user=>{
				this.logService.log("Se creo un nuevo usuario",user._id);
				return res.status(HttpStatus.OK).json({
					response: 2,
					content:{
						user
					}
				});
			})
			.catch(err=>{
				res.status(HttpStatus.OK).json({
					response: 1,
					content:{
						err
					}
				});
				throw new Error(err);
			})
	}
	@Get('/products/getByTag')
	async getProductsByTag(@Res() res, @Query('tag') tag : string ) {
		this.productService.getProductsByTag(tag)
			.then(products=>{
				return res.status(HttpStatus.OK).json({
					response: 2,
					content:{
						products
					}
				});
			})
			.catch(err=>{
				throw new Error(err);
			})
	}
}

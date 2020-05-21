/* Nest js Dependencies */
import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
/** DTOs */
import { CreateUserPetsDTO } from "./dto/user-pets.dto";
/* Services */
import { UserPetsService } from "./user-pets.service";
import { LogPetsService } from "../log-pets/log-pets.service";
import { ProductsService } from '../products/products.service';
import { PartnerService } from "../partner/partner.service";

@Controller('user-pets')
export class UserPetsController {

	constructor(
		private userPetsServie : UserPetsService,
		private logService : LogPetsService,
		private productService : ProductsService,
		private partnerService  : PartnerService
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
				if(!products.length){
					return res.status(HttpStatus.OK).json({
						response: 1,
						content:{
							message : "Ups, no encontramos productos con ese tag"
						}
					});
				}else{
					/* Make a loop to search the name partner to add every product*/ 
					let loop = new Promise((resolve,reject)=>{
						products.forEach((element,index) => {
							/* Search the partner by id to obtain the name */
							this.partnerService.getPartnerById(element.idPartner)
								.then(partner=>{
									/* Set the namePartner propertie */
									element.namePartner = partner.appName;
									/* If is the end of the loop, then resolve the primise to return the reponse*/
									if (index === products.length -1) resolve();
								})
								.catch(err=>{
									reject();
									throw new Error(err);
								})
						});
						
					});
					/* When the loop ends then resolve the prmose and return the response */
					loop.then(()=>{
						console.log("legue");
						return res.status(HttpStatus.OK).json({
							response: 2,
							content:{
								products : products
							}
						});
					});
				};
			})
			.catch(err=>{
				throw new Error(err);
			})
	}
}

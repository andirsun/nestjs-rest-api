/* Nest js Dependencies */
import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
/** DTOs */
import { CreateUserPetsDTO } from "./dto/user-pets.dto";
/* Services */
import { UserPetsService } from "./user-pets.service";
import { LogPetsService } from "../log-pets/log-pets.service";
import { ProductsService } from '../products/products.service';
import { PartnerService } from "../partner/partner.service";
import { Product } from '../products/interfaces/product.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import { UserPets } from './interfaces/user-pets.interfaces';


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
	@Get('/check')
	async checkUser(@Res()res, @Query('phone')phone :number){
		/* Check id the user exists in the db with this phone */ 
		this.userPetsServie.getUser(phone)
		.then(user=>{
			this.logService.log("Se consulto si existe un usuario",phone.toString());
			if(user){
				/* User Registered */
				return res.status(HttpStatus.OK).json({
					response: 2,
					content:{
						message : 'El usuario ya esta registrado'
					}
				});
			}else{
				/* If the user doesnt exists */
				return res.status(HttpStatus.OK).json({
						response: 1,
						content:{
							message : 'El usuario es nuevo'
						}
					});
				}
			})
			.catch(err=>{
				throw new Error(err);
			})
	}
	@Post('/login')
	async loginUser(@Res()res,@Body() loginUserDTO : LoginUserDTO){
		/* Check is user already Exists */
		const user : UserPets = await this.userPetsServie.checkUserByEmail(loginUserDTO.email); 
		/* User registered */
		if(user){
			return res.status(HttpStatus.OK).json({
				response: 2,
				content:{
					message : 'El usuario ya esta registrado',
					code : 1,
				}
			});
		}else{
			/* If is new User, then need to register */
			let newUser : CreateUserPetsDTO = loginUserDTO;
			/* Analitical porpuses */
			newUser.registerMethod = loginUserDTO.method;
			/* If the user have phone */
			this.userPetsServie.createUser(newUser)
				.then(user =>{
					return res.status(HttpStatus.OK).json({
						response: 2,
						content:{
							user,
							code : 2 //means need to redirect home
						}
					});
				})
				.catch(err =>{
					console.log(err);
				})
		}
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
						var productsObjectArray = [];
						products.forEach((element,index) => {
							/* Search the partner by id to obtain the name */
							this.partnerService.getPartnerById(element.idPartner)
								.then(partner=>{
									/* This is neccesary to add properties to a mongoose object */
									var elementObj = element.toObject();
									/* Set the namePartner propertie */
									elementObj.namePartner = partner.appName;
									/* Delete unused properties for frontend */
									delete elementObj.rates;
									delete elementObj.usersRates;
									delete elementObj.tags;
									delete elementObj.__v;
									/* Push the element to return array*/
									productsObjectArray.push(elementObj);
								})
								.catch(err=>{
									reject();
									throw new Error(err);
								})
								.finally(()=>{
									/* If is the end of the loop, then resolve the primise to return the reponse*/
									if (index === products.length -1) resolve(productsObjectArray);
								})
						});
						
					});
					/* When the loop ends then resolve the prmose and return the response */
					loop.then((productsModified)=>{
						return res.status(HttpStatus.OK).json({
							response: 2,
							content:{
								products : productsModified
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

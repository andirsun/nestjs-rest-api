import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query, Redirect, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
/* Services */
import { PartnerService } from "./partner.service";
import { LogPetsService } from "../log-pets/log-pets.service";
import { TwilioService } from "src/modules/twilio/twilio.service";
import { ProductsService } from "../products/products.service";
/* DTOs */
import { CreatePartnerDTO } from "./dto/partner.dto";
import { CreateProductDTO } from "../products/dto/product.dto";
/* Interfaces */
import { Product } from "../products/interfaces/product.interface";
import { Partner } from "../partner/interfaces/partner.interface";




@Controller('partner')
export class PartnerController {
	/*
		In the constructor we can import Dtos, services
		, schemas etc to be injected
	*/
	constructor(
		private partnerService: PartnerService,
		private logService: LogPetsService,
		private twilioService : TwilioService,
		private productService : ProductsService
	) {}
	
	
	/*
	  Endpoint to create a partner user
	*/
	@Post('/createPartner')
	async createPartner(@Res() res, @Body() createPartnerDTO: CreatePartnerDTO) {
		await this.partnerService.createUser(createPartnerDTO)
			.then((partner) => {
				/* Create a log */
				this.logService.log("Se creo un nuevo partner", partner._id)
				return res.status(HttpStatus.OK).json({
					response: 2,
					content: {
						partner
					}
				});
			})
			.catch((err) => {
				console.log("llegue negativo");
				this.logService.error("Error al crear un partner","none");
				return res.status(HttpStatus.BAD_REQUEST).json({
					response: 3,
					content: err
				});
			});
	};
	/*
			This function create a product and associate 
			this product with a partner
			First : get the partner id with a phoneNumber
			second : save in partner.product the id of the
			product inserted
	*/
	@Post('/products/create')
	@UseGuards(AuthGuard())
	async createProduct(@Res() res, @Body() createProductDTO: CreateProductDTO) {
		/* Search a partner with a phone number */
		const partner : Partner = await this.partnerService.getPartnerByPhone(createProductDTO.phone);
		/*If the partner was not found */
		if(!partner){
			return res.status(HttpStatus.OK).json({
				response: 1,
				content: {
					message : "Ups, no encontramos ningun usuario con ese telefono"
				}
			});
		}
		/*If the partner was found with this phone number */
		await this.productService.createProduct(partner._id,createProductDTO)
			.then((product : Product)=>{
				this.logService.log("Se creo un nuevo producto",product._id);

				/* Associate the product to the partner */
				this.partnerService.addProductToPartner(partner._id,product._id)
					.then((partner : Partner)=>{
						this.logService.log("Se agrego un producto a un aliado",product._id);
						return res.status(HttpStatus.OK).json({
							response: 2,
							content: {
								partner
							}
						});
					})
					.catch((err)=>{
						this.logService.error("Error al asociar un producto a un aliado",product._id);
						throw new Error(err);
					});
			
			})
			.catch((err)=>{
				this.logService.error("Ocurrio un error al tratar de guardar un nuevo producto","none");
				throw new Error(err);
			});
	};
	/*
		This function returns all products of a partner
		needs a phone number send by query params
	*/
	@Get('/products/getProducts')
	@UseGuards(AuthGuard())
	async getProducts(@Res() res, @Query('phone') phone : number ) {
		/* Search user with phone */
		const user = await this.partnerService.getPartnerByPhone(phone);
		/* if the user wasnt found */
		if(!user){
			return res.status(HttpStatus.OK).json({
				response: 1,
				content: {
					message : "Ups, no encontramos ningun usuario con ese telefono"
				}
			});
		}else{
			/* User Found */
			// Get partner products
			const products : Product[]= await this.productService.getPartnerProducts(user._id);
			/* Fetch products to db */
			this.logService.log("Un aliado consulto sus productos",user._id);
			/* If exists products */
			if(products.length > 0){
				this.logService.log("Se retornaron los productos correctamente",user._id);
				return res.status(HttpStatus.OK).json({
					response: 2,
					content: {
						products
					}
				});
			}else{
				this.logService.log("Se retornaron los productos correctamente",user._id);
				return res.status(HttpStatus.OK).json({
					response: 1,
					content: {
						message : "El usuario no tiene productos aun"
					}
				});
			}
		}
		
	};
	/*
		This function returns particular products of a partner
		needs a idProduct send by query params
	*/
	@Get('/products/getProduct')
	@UseGuards(AuthGuard())
	async getProduct(@Res() res, @Query('idProduct') idProduct : string ) {
		this.productService.getProduct(idProduct)
			.then((product : Product)=>{
				this.logService.log("Se consulto un producto",idProduct);
				if(product){
					return res.status(HttpStatus.OK).json({
						response: 2,
						content: {
							product
						}
					});
				}else{
					return res.status(HttpStatus.OK).json({
						response: 1,
						content: {
							message : "Ups no encontramos un producto con ese id"
						}
					});
				}
			})
			.catch((err)=>{
				this.logService.error("Ocurrio un error al tratar de consultar un producto",idProduct);
				throw new Error(err);
			})
		
	};
	//Testing porpusses
	@Post('/sendSms')
	async sendSms(@Res() res){
		this.twilioService.sendWhatsAppMessage(318875881,`Your verification code is 4564654`,871125)
			.then((message)=>{
				this.logService.log(`Se en envio un mensaje de twilio exitosamente '${""}' al numero ${""}`,message.sid)
			})
			.catch((err)=>{
				this.logService.error("Ocurrio un error al tratar de enviar el mensaje '${'}' al usuario ${'} ","none");
				/* Interceptor send to sentry service */
				throw new Error(err);
			});

	};
	@Get('test')
	@UseGuards(AuthGuard())
	testAuthRoute(){
			return {
					message: 'You did it!'
			}
	};
}

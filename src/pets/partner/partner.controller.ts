import {
	Controller,
	Get,
	Post,
	Put,
	Res,
	HttpStatus,
	Body, 
	Query, 
	UseGuards,
	UseInterceptors,
	UploadedFile, 
	Req, 
	Ip,
	forwardRef,
	Inject
} from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from '@nestjs/passport';
/* Services */
import { PartnerService } from "./partner.service";
import { LogPetsService } from "../log-pets/log-pets.service";
import { TwilioService } from "src/modules/twilio/application/twilio.service";
import { ProductsService } from "../products/products.service";
import { FilesService } from 'src/modules/files/application/files.service';
import { OrdersService } from '../orders/orders.service';
/* DTOs */
import { CreatePartnerDTO } from "./dto/partner.dto";
import { CreateProductDTO } from "../products/dto/product.dto";
import { CreateProductPresentationDTO } from '../products/dto/productPresentation.dto';
import { OrderChangeDTO } from '../orders/dto/changeOrder.dto';
/* Interfaces */
import { Product } from "../products/interfaces/product.interface";
import { Partner } from "../partner/interfaces/partner.interface";
import { FileInterface } from 'src/modules/files/domain/file.interface';




@Controller('partner')
export class PartnerController {
	/*
		In the constructor we can import Dtos, services
		, schemas etc to be injected
	*/
	constructor(
		/* Own Service */
		private partnerService: PartnerService,
		/* External services from other modules */
		private logService: LogPetsService,
		private productService : ProductsService,
		private filesService : FilesService,
		
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
	//@UseGuards(AuthGuard())
	@UseInterceptors(FileInterceptor('file'))
	async createProduct(@Res() res, @Body() createProductDTO: CreateProductDTO,@UploadedFile() file : FileInterface) {
		/* Search a partner with a phone number */
		console.log(createProductDTO,file);
		const partner : Partner = await this.partnerService.getPartnerByPhone(createProductDTO.phone);
		/*If the partner was not found */
		if(!partner){
			return res.status(HttpStatus.OK).json({
				response: 1,
				content: {
					message : "Ups, no encontramos ningun usuario con ese numero"
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
						
						/* Upload the Img to spaces ssd server */
						let remotePath : string = `Pets/Products/${partner._id}/${product._id}/`;
						this.filesService.uploadFile(remotePath,file.originalname,file.buffer,"PUBLIC")
							.then((response : any)=>{

								/* Asociate the Url of the inserted img to product */
								this.productService.addUrlImgToProduct(product._id,this.filesService.getURL())
									.then(resp =>{
										return res.status(HttpStatus.OK).json({
											response : 2,
											content : {
												message : 'UPLOADED',
												description : '¡Archivo subido exitosiamente!',
												remoteFilename : this.filesService.getRemoteFileName(),
												url : this.filesService.getURL(),
												urlFull : this.filesService.getURLParams(),
												//params : spacesUtils.getParams(spacesUtils.getRemoteFileName())
												product
											}
										});
									})
									.catch(err=>{
										throw new Error(err);
									})
								
							})
							.catch((err : Error)=>{
								return res.status(HttpStatus.BAD_REQUEST).json({
									response : 1,
									content : {
										message : 'ERROR',
										description : '¡Ups, tuvimos un problema!',
										error : 'FILE CORRUPTED OR NOT FOUND IN BACKEND'
									}
								});
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
		This function create a presentation of the certain product
	*/
	@Post('/products/presentations/new')
	@UseInterceptors(FileInterceptor('file'))
	async createProductPresentation(@Res() res,@Query('idProduct')idProduct : string,
																	@Query('idPartner')idPartner : string,@Req() req,
																	@Body() createProductPresentationDTO: CreateProductPresentationDTO,
																	@UploadedFile() file : FileInterface) {
		/* First add product presentation to product */
		this.productService.createProductPresentation(idProduct,createProductPresentationDTO)
			.then(product=>{
				
				/* Create log with product presentation inserted */
				this.logService.log("Se creo una presentacion de un producto",product.presentations[product.presentations.length-1]._id);
				
				/* Build the remote path to upload presentation img  */
				let remotePath : string = `Pets/Products/${idPartner}/${idProduct}/Presentations/`;
				/* Upload the product presentation image */
				this.filesService.uploadFile(remotePath,file.originalname,file.buffer,"PUBLIC")
					.then((response : any)=>{

						/* Asociate the Url of the inserted img to product */
						this.productService.addUrlImgToPresentation(idProduct,this.filesService.getURL())
							.then(resp =>{
								return res.status(HttpStatus.OK).json({
									response : 2,
									content : {
										message : 'UPLOADED',
										description : '¡Archivo subido exitosiamente!',
										remoteFilename : this.filesService.getRemoteFileName(),
										url : this.filesService.getURL(),
										urlFull : this.filesService.getURLParams(),
										//params : spacesUtils.getParams(spacesUtils.getRemoteFileName()),
										product : resp
									}
								});
							})
							.catch(err=>{
								throw new Error(err);
							})
						
					})
					.catch((err : Error)=>{
						return res.status(HttpStatus.BAD_REQUEST).json({
							response : 1,
							content : {
								message : 'ERROR',
								description : '¡Ups, tuvimos un problema!',
								error : 'FILE CORRUPTED OR NOT FOUND IN BACKEND'
							}
						});
					});
				
			})
			.catch((err)=>{
				throw new Error(err);
			});
	};
	/*
		This function returns all products of a partner
		needs a phone number send by query params
	*/
	@Get('/products/getProducts')
	//@UseGuards(AuthGuard())
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
	//@UseGuards(AuthGuard())
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
	@Post('/uploadFile')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@Res() res,@UploadedFile() file : FileInterface){
			//console.log(file);
		let fileName : string = "logob.png";
		let visibility : string = "PUBLIC";
		this.filesService.setRemoteFileName(fileName);
		this.filesService.uploadFile("",file.originalname,file.buffer,visibility)
			.then((response : any)=>{
				return res.status(HttpStatus.OK).json({
					response : 2,
					content : {
						message : 'UPLOADED',
						description : '¡Archivo subido exitosiamente!',
						remoteFilename : this.filesService.getRemoteFileName(),
						url : this.filesService.getURL(),
						urlFull : this.filesService.getURLParams(),
						//params : spacesUtils.getParams(spacesUtils.getRemoteFileName())
					}
				});
			}).catch((err : Error)=>{
				return res.status(HttpStatus.BAD_REQUEST).json({
					response : 1,
					content : {
						message : 'ERROR',
						description : '¡Ups, tuvimos un problema!',
						error : 'FILE CORRUPTED OR NOT FOUND IN BACKEND'
					}
				});
			});

	};
}

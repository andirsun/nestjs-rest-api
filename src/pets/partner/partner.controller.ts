import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query, Redirect, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
/* Services */
import { PartnerService } from "./partner.service";
import { LogPetsService } from "../log-pets/log-pets.service";
import { TwilioService } from "src/modules/twilio/twilio.service";
/* DTOs */
import { CreatePartnerDTO } from "./dto/partner.dto";
/* Personal Libraries */




@Controller('partner')
export class PartnerController {
	/*
		In the constructor we can import Dtos, services
		, schemas etc to be injected
	*/
	constructor(
		private partnerService: PartnerService,
		private logService: LogPetsService,
		private twilioService : TwilioService
	) {}
	
	@Get('test')
	@UseGuards(AuthGuard())
	testAuthRoute(){
			return {
					message: 'You did it!'
			}
	}
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
	@Post('/pets/products/createProduct')
	async createProduct(@Res() res, @Body() createPartnerDTO: CreatePartnerDTO) {
		
	};
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

	}
}

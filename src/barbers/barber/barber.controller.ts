import { Controller, Get, Res, Query, HttpStatus, Post, Body, Ip } from '@nestjs/common';
import { BarberService } from './barber.service';
import { PaymentBarberLogDTO } from './dto/paymentLog.dto';
import { LogBarbersService } from '../log-barbers/log-barbers.service';

@Controller('barber')
export class BarberController {

  constructor(
		private barberServices : BarberService,
		private logService : LogBarbersService
  ){}
  @Get('/getByCity')
	async getActiveOrdersByCity(@Res() res,@Query('city')city : string){
		await this.barberServices.getBarbersByCity(city)
				.then((barbers)=>{
						console.log("Llegue positivo");
						return res.status(HttpStatus.OK).json({
								response: 2,
								content: {
                  barbers
                }
						});
				})
				.catch((err)=>{
						console.log("llegue negativo");
						throw new Error(err);
						// return res.status(HttpStatus.BAD_REQUEST).json({
						// 		response: 3,
						// 		content: err
						// });
				});   
	}

	/*
		This endpoint make a recarge of balance
	*/
	@Post('/payments/chargeBalance')
	async makeNewPayment(@Res() res, @Body() body : PaymentBarberLogDTO,@Ip() ip : string){
		/* FIrst step : make the recharge */
		this.barberServices.makePaymentCharge(body.idBarber,body.amount)
			.then(resp =>{
				this.logService.log("Se recargo la cuenta del barbero",body.idBarber);
				/* Then Create A log of payment */
				this.barberServices.addPaymentLog(body.idBarber,body.amount,body.paymentId,ip)
					.then(barber =>{
						this.logService.log("Se creo un log de pago para un barbero",body.idBarber);
						return res.status(HttpStatus.OK).json({
							response: 2,
							content: {
								message : "Genial!, tu cuenta se recargo correctamente",
								balance : barber.balance,
								payments : barber.payments
							}
						});
					})
					.catch(err=> {
						throw new Error(err);
					});
			})
			.catch(err=> {
				throw new Error(err);
			});
		
	}
}


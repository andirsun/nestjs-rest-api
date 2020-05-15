import { Controller, Get, Res, Query, HttpStatus } from '@nestjs/common';
import { BarberService } from './barber.service';

@Controller('barber')
export class BarberController {

  constructor(
    private barberServices : BarberService
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
}


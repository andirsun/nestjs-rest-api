import { Controller,Get,Post,Put,Delete,Res,HttpStatus,Body, Query} from '@nestjs/common';
/* Services */
import { PartnerService } from "./partner.service";
import { LogPetsService } from "../log-pets/log-pets.service";
/* DTOs */
import { CreatePartnerDTO } from "./dto/partner.dto";
@Controller('partner')
export class PartnerController {
    /*
        In the constructor we can import Dtos, services
        , schemas etc to be injected
    */
    constructor(
        private partnerService : PartnerService,
        private logService : LogPetsService
    ){}
		
		/*
			Endpoint to create a partner user
		*/
    @Post('/createPartner')
    async createUser(@Res() res, @Body() createPartnerDTO : CreatePartnerDTO ){
      await this.partnerService.createUser(createPartnerDTO)
            .then((partner)=>{
								/* Create a log */
								this.logService.log("Se creo un nuevo partner",partner._id)
                console.log("Llegue positivo");
                return res.status(HttpStatus.OK).json({
                    response: 2,
                    content:{
											partner
										} 
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

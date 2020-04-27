/* Nest js dependencies */
import { Injectable } from '@nestjs/common';
/*Moongose Dependencies */ 
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
/* Interfaces */
import { Partner } from "./interfaces/partner.interface";
/* necesary to read the .env files */
require("dotenv").config();
/* DTOs */
import { CreatePartnerDTO } from "./dto/partner.dto";

@Injectable()
export class PartnerService {
	/*
		The constructor only works to inject the partener module only
		if Model<Partner> interface extends a Document from mongoose
	*/
	constructor (@InjectModel('Partner') private readonly partnerModel : Model<Partner>){}

	/* Functions  */

	/*
			THis function create an user. you need to pass the
			CreateUserDto object to works
	*/
	async createUser(createPartnerDTO : CreatePartnerDTO) : Promise<Partner>{
		// Initialize the user with the data transfer object 
		const user = new this.partnerModel(createPartnerDTO);
		//Return the insert query to be handle in the controller
		return await user.save();
}
}

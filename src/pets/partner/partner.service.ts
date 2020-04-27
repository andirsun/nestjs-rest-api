/* Nest js dependencies */
import { Injectable } from '@nestjs/common';
/*Moongose Dependencies */ 
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
/* Interfaces */
import { Partner } from "./interfaces/partner.interface";
/* necesary to read the .env files */
require("dotenv").config();

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
	async createUser(createPartnerDTO : CreateUserDTO) : Promise<Partner>{
		const user = new this.userModel(createUserDTO);
		return await user.save();
}
}

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
/* Schemas */
import { PartnerSchema } from "./schemas/partner.schema";

@Injectable()
export class PartnerService {
	/*
		The constructor only works to inject the partener module only
		if Model<Partner> interface extends a Document from mongoose
	*/
	constructor (@InjectModel('Partner') private readonly partnerModel : Model<Partner>){}
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
	async getPartner(partnerID : string) : Promise<Partner>{
		const partner = await this.partnerModel.findById(partnerID);
		return partner;
	}

	// async updatePassword(partnerID : string, createPartnerDTO : CreatePartnerDTO) : Promise<Partner>{
	// 	const updatedPartner = await this.partnerModel.findByIdAndUpdate(partnerID,createPartnerDTO,{new : true})
	// 	return updatedPartner;
	// }
}

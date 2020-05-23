require("dotenv").config();

import { Injectable } from '@nestjs/common';

/*Moongose Dependencies */ 
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { UserPets } from "./interfaces/user-pets.interfaces";
/** Data transfer object */
import { CreateUserPetsDTO } from "./dto/user-pets.dto";

@Injectable()
export class UserPetsService {

    constructor(@InjectModel('UserPets') private readonly userPetsModel : Model<UserPets>){}

    /** Queries to the database */
    /*
        This function save an user in the DB
    */
    async createUser(createUserPetsDTO:CreateUserPetsDTO) : Promise<UserPets>{
        const user = new this.userPetsModel(createUserPetsDTO);
        return await user.save();
    }
    /*
        This function returns an user from the database
    */
    async getUser(phone:number) : Promise<UserPets>{
        const user = await this.userPetsModel.findOne({phone:phone});
        return user;
    }
    /*
        This function check if users exists with this email
    */
   async checkUserByEmail(email: string): Promise<UserPets>{
       const user = await this.userPetsModel.findOne({email:email});
       return user;
   } 




}

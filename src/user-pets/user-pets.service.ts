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


}

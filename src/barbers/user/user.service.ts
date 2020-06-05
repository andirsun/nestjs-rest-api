/* Nest js Imports */
import { Injectable } from '@nestjs/common';
/*Moongose Dependencies */ 
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
/*Require Interface to handle info*/
import { User } from "./interfaces/user.interfaces";
//data transfer object
import { CreateUserDTO } from "./dto/user.dto";


// This file works to make queries to the databse 
@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel : Model<User>){}
    /* Queries */
    /*
        This function return the all the users in the database
    */
    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find();
        return users;
    }
    /* 
        Function that return a particular user by id 
        from the database 
    */
    async getUser(userId : number):Promise<User>{
				const user = await  this.userModel.findById(userId);
				return user;
    }
    /*
        Function that returns a user by phone
    */
    async getUserByPhone(phone : number):Promise<User>{
        const user = await  this.userModel.findOne({phone : phone });
        return user;                                                                                                                    
    }
    /*
        THis function create an user. you need to pass the
        CreateUserDto object to works
    */
    async createUser(createUserDTO : CreateUserDTO) : Promise<User>{
        const user = new this.userModel(createUserDTO);
        console.log("object");
        return await user.save();
    }
    

}

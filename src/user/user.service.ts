//Nest js Impor
import { Injectable } from '@nestjs/common';
//Moongose Dependencies
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
//Require Interface to handle info
import { User } from "./interfaces/user.interfaces";
//data transfer object
import { CreateUserDTO } from "./dto/user.dto";

// This file works to make queries to the databse 
@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel : Model<User>){}
    /* Queries*/
    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find();
        return users;
    }

    async getUser(userId : string):Promise<User>{
         const user = await  this.userModel.findById(userId);
         return user;
    }

    async createUser(createUserDTO : CreateUserDTO) : Promise<User>{
        const user = new this.userModel(createUserDTO);
        // const response = await user.save((err,response)=>{
        //     if(err){
        //         console.log("entre al bug", err);
        //         return err
        //     }else{
        //         return response
        //     }
        // });
        // console.log(response);
        // return response;
        return await user.save();
    }

}

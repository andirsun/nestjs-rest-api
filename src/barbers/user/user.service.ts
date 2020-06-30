/* Nest js Imports */
import { Injectable } from '@nestjs/common';
/*Moongose Dependencies */ 
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
/*Require Interface to handle info*/
import { User } from "./interfaces/user.interfaces";
import { UserPromCodeInterface } from './interfaces/user-promcode.interface';
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
    Get All User Emails
  */
  async getUserEmails(): Promise<User[]> {
    const usersEmails = await this.userModel.find({},'email');
    return usersEmails;
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
    Function that returns all codes links to user
  */
  async getUserPromCodes(userId: string) : Promise<UserPromCodeInterface[]>{
    const user = await this.userModel.findById(userId)
    return user.promotionalCodes
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

  /*
  This function add points into barber docuemnt, when the order is finished. 
  return user document.
  */
  async addUserPoints(userId: string, points : number) : Promise<User>{
    const user = await this.userModel.findByIdAndUpdate(userId,{ $inc:{ points }});
    return user;
  }

  /*
    Links the given code to the user document
  */
  async linkPromCodeToUser(userId: string, userPromCode: UserPromCodeInterface ) : Promise<User>{
    const user = this.userModel.findByIdAndUpdate(userId,{$push : {promotionalCodes: userPromCode }}, {new: true})
    return user;
  }
    

}

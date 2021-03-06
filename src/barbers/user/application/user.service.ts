/* Nest js Imports */
import { Injectable } from '@nestjs/common';
/*Moongose Dependencies */ 
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
/*Require Interface to handle info*/
import { User } from "../domain/interfaces/user.interface";
import { UserPromCodeInterface } from '../domain/interfaces/user-promcode.interface';
//data transfer object
import { CreateUserDTO } from "../domain/dto/user.dto";
//services
import { TimeService } from 'src/modules/time/application/time.service';


// This file works to make queries to the databse 
@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly userModel : Model<User>,
    private timeService: TimeService,
  ){}
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
    Function that returns a user by email
  */
  async getUserByEmail(email : string):Promise<User>{
    const user = await this.userModel.findOne({email});
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
  async createUser(createUserDTO : CreateUserDTO, method : string) : Promise<User>{
    //create the user model with all parameters from interface
    let user = new this.userModel(createUserDTO);
    //Add the current date and registration method
    user.registrationDate = this.timeService.getCurrentDate();
    user.registrationMethod = method;
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

  /*
    Get registered users BY Date
  */
  async registeredUsers():Promise<User[]>{
    // search only the users who the socuments has the updated propertie and returns the document only with this propertie
    let users : User[] = await this.userModel.find({updated : {$ne : undefined}},'updated');
    return users
  }

  /*
    Update Last conection date
  */
  async updateLastConnection(idUser : string): Promise<User>{
    //get the current time from time Module
    let currentDate : string = this.timeService.getCurrentDate();
    // Update the propertie last connection and return the last value of user
    let user : User = await this.userModel.findByIdAndUpdate(idUser,{lastConnection : currentDate},{new: true});
    return user;
  }
    

}

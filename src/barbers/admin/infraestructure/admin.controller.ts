// Nest dependencies
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
// External services
import { UserService } from "../../user/user.service";
import { TimeService } from '../../time/time.service';
import { resolve } from 'path';
import { rejects } from 'assert';


@Controller('admin')
export class AdminController {

  constructor(
    private userService : UserService,
    private timeService : TimeService,
  ){}
  /*
    This endpoint return all barbers in a city
  */
  @Get('/barbers/users/emails')
  async getEmailUsers(@Res() res){
    this.userService.getUserEmails()
      .then((emails)=>{
        let emailsArray : [string] = [""]

        let cycle = new Promise((resolve, reject) => {
          emails.forEach((value, index) => {
              emailsArray.push(value.email);
              if (index ===emails.length -1) resolve();
          });
        });
      
        cycle.then(() => {
          return res.status(HttpStatus.OK).json({
            response: 2,
            content: {
              emails : emailsArray
            }
          });
        });
      })
      .catch((err)=>{
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: err
        });
        throw new Error(err);
      });   
  }
  /*
    Endpoint to return the total amount of register users
  */
  @Get('/barbers/users/registered')
  async getRegisterUsers(@Res() res){
    
    this.userService.registeredUsers()
      .then(users => {
        // Define the interface of weeks to return
        interface weeksFormat {
          year : number, //year pf registration
          numberWeek : number, // week number ex 1,2,3,4
          firstDayOfWeekDate : string, //example "2020-05-10"
          newUsers : number, // amount of new Users registered this week
        }
        //First week number
        let firstWeek : number = this.timeService.getWeekNumber(users[0].updated);
        // last week number
        let lastWeek : number = this.timeService.getWeekNumber(users[users.length-1].updated);
        // Incremental array of number from 1 to last week
        let weekArray : number[]= Array.from({length:lastWeek},(v,k)=>k+1);
        // segment the array only to first week number to last week number
        weekArray = weekArray.slice(firstWeek-1);
        // creating a empty dictionary with format <string : weeksFormat>
        let weeks: { [key: string] : weeksFormat; } = {};
        /*
          this foreach create every initialize key : value
          with the range from firsWeek and last Week
          Example : 
          "2020-19": {
            "year": 2020,
            "numberWeek": 19,
            "newUsers": 0,
            "firstDayOfWeekDate": "2020-05-10"
          },
          "2020-20": {
              "year": 2020,
              "numberWeek": 20,
              "newUsers": 0,
              "firstDayOfWeekDate": "2020-05-17"
          },
        */
        var firstLoop = new Promise((resolve, reject) => {
          weekArray.forEach((week,index,array) =>  {
            //build the format of interface
            let week2Push : weeksFormat = {
              year : 2020,
              numberWeek : week,
              newUsers : 0,
              firstDayOfWeekDate : this.timeService.getTimeWithYearAndWeek(2020,week)
            }
            let key = `${2020}-${week}`;
            // push the week item into dictionary of weeks with key : value
            weeks[key] = week2Push;
            if (index === array.length -1) resolve();
          });
        });
        // Excecutes only when the first loop ends  
        firstLoop.then(() => {
          let secondLoop = new Promise((resolve,reject)=>{
            
            /*
              This foreach add +1 to every new user registered depends in
              which week he register in the app
            */
            users.forEach((user,index,array) => {
              // create a composed key: 'year-week'
              const yearWeek = `${this.timeService.getYear(user.updated)}-${this.timeService.getWeekNumber(user.updated)}`;
              weeks[yearWeek].newUsers++; 
              if (index === array.length -1) resolve();
            });
          
          })
          // excecute when the second loop ends  
          secondLoop.then(()=>{
            //Return the response
            return res.status(HttpStatus.OK).json({
              response: 2,
              content: weeks
            });
          })
        });
        
        
        
        
      })
      .catch(err=>{
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 1,
          content: {
            message : "Ups, no se pudo obtener los usuarios"
          }
        });
        throw new Error(err);
      })
  }
   /*
    Endpoint to return the total amount of register users
  */
  @Get('/barbers/orders/all')
  async getServices(@Res() res){
    
    
  }
}

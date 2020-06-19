// Nest dependencies
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
// External services
import { UserService } from "../user/user.service";


@Controller('admin')
export class AdminController {

  constructor(
    private userService : UserService,
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
          emails.forEach((value, index, array) => {
              emailsArray.push(value.email);
              if (index === array.length -1) resolve();
          });
        });
      
        cycle.then(() => {
          return res.status(HttpStatus.OK).json({
            response: 2,
            content: {
              emails
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
}

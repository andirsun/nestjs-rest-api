/* Nest Js dependencies */
import { Controller,Get,Post,Res,HttpStatus,Body, Query, Put} from '@nestjs/common';
//Data Onjects Transfer are all the interfaces to transfer betwen this class en requests
import { CreateUserDTO } from "../domain/dto/user.dto";
import { UserPromCodeDTO } from '../domain/dto/user-promcode.dto';
/* Services */
import { UserService } from "../application/user.service";
import { LogBarbersService } from "../../log-barbers/application/log-barbers.service";
import { PromotionalCodeService } from '../../promotional-codes/promotional-codes.service';
import { TimeService } from '../../../modules/time/application/time.service';
import { OrdersService } from '../../orders/application/orders.service';
/*Interfaces*/
import { UserPromCodeInterface } from '../domain/interfaces/user-promcode.interface';
import { User } from '../domain/interfaces/user.interface';


@Controller('user')
export class UserController {

  constructor(
    private userService : UserService,
    private logService : LogBarbersService,
    private promotionalCodeService: PromotionalCodeService,
    private timeService: TimeService,
    private ordersService : OrdersService
  ){}
  /*
		This endpoint return all users registered in database
	*/
  @Get('/get/all')
  async getAll(@Res() res){
    //Check all user codes
    this.userService.getUsers()
      .then( (users) => {
        //Check if the user has codes
        return res.status(HttpStatus.OK).json({
          response: 2,
          content:{
            users
          }
        })
      })
      .catch ( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content : {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      })
  }

  /*
		This endpoint return all valid user's prom codes
	*/
  @Get('/getUserPromCodes')
  async getUserPromCodes(@Res() res, @Query('userId') userId: string){
    //Check all user codes
    this.userService.getUserPromCodes(userId)
      .then( (codes) => {
        //Check if the user has codes
        if(codes.length == 0){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content:{
              message: 'No tienes códigos promocionales'
            }
          })
        }
        //Set array with not expired codes only 
        this.timeService.getExpiredCodes(codes)
          .then( (verifiedCodes) => {
            //Check if all user's codes has already expired
            if(verifiedCodes.length == 0){
              return res.status(HttpStatus.BAD_REQUEST).json({
                response: 1,
                content:{
                  message: 'No tienes códigos promocionales'
                }
              })
            }
            return res.status(HttpStatus.OK).json({
              response: 2,
              content:{
                codes: verifiedCodes
              }
            })

          })
          .catch ( (err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
              response: 3,
              content : {
                message: 'Ups! Ha ocurrido un error'
              }
            })
            throw new Error(err);
          })
      })
      .catch ( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content : {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      })
  }

  /*
    Check if user is already registered
  */
  @Get('/register/status')
  async getRegisterStatus(@Res()res, @Query('method')method : "PHONE" | "SOCIAL",@Query('phone')phone : number,@Query('email')email : string){
    let user : User ; 
    if(method == "PHONE"){
      user = await this.userService.getUserByPhone(phone);
    }else if(method == "SOCIAL") {
      user = await this.userService.getUserByEmail(email);
    }
    //check if exists an user with phone or email
    if(!user){  
      return res.status(HttpStatus.OK).json({
        response: 2,
        content:{
          status : "NEW",
          message : "No encontramos a un usuario con ese telefono o correo"
        }
      });
    }else {
      return res.status(HttpStatus.OK).json({
        response: 2,
        content:{
          status : "REGISTERED",
          message : "El usuario ya esta registrado"
        }
      });
    }
  }
  /*
    This endpoint return a specific user
    searching by id
  */
  @Get('/info')
  async getUserById(@Res() res,@Query('idUser')idUser : number){
    await this.userService.getUser(idUser)
      .then(user=>{
        return res.status(HttpStatus.OK).json({
          response: 2,
          content:{
            user
          }
        });
      })
      .catch(err=>{
        /* Sentry report */
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 1,
          content:{
            message : "no encontramos a un usuario con ese id"
          }
        });
        throw new Error(err);
      })
  }

  /*
    This endpoint return all users of Timugo Barbers
  */
  @Get('/getAll')
  async getUsers(@Res() res){
    await this.userService.getUsers()
      .then(users=>{
        this.logService.log("Se consultaron los usuarios","none");
        return res.status(HttpStatus.OK).json({
          response: 2,
          content:{
            users
          }
        });
      })
      .catch(err=>{
        /* Local log */
        this.logService.error("Error al consultar los usuarios","none");
        /* Sentry report */
        throw new Error(err);
      })
  }

  /*
    this function check if an user is in a order in progress
  */
  @Get('/checkOrder')
  async checkInCurrentOrder (@Res() res, @Query('idUser')idUser : string){
    this.ordersService.getActiveOrdersByIdUserAndStatus(idUser,"PENDING")
      .then(order=>{
        if (!order) {
          return res.status(HttpStatus.FORBIDDEN).json({
            response: 1,
            content: {
              message : "El usuario no tiene ninguna orden pendiente"
            }
          });  
        } else {
          return res.status(HttpStatus.OK).json({
            response: 1,
            content: {
              message : "El usuario no tiene ninguna orden pendiente"
            }
          });
        }
      })
      .catch(err =>{
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: {
            error : err
          }
        });
        throw new Error(err);
      })
  }

  /*
    this function check if an user has token
  */
  @Get('/checkToken')
  async checkToken (@Res() res, @Query('phoneUser')phone : number){
    this.userService.getUserByPhone(phone)
      .then(user=>{
        if (!user) {
          return res.status(HttpStatus.FORBIDDEN).json({
            response: 1,
            content: {
              message : "No se encontro a un usuario con ese telefono"
            }
          });  
        } else if(user.phoneToken == "none"){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content: {
              message : "El usuario no tiene phone token definido"
            }
          });
        } else {
          return res.status(HttpStatus.OK).json({
            response: 2,
            content: {
              token : user.phoneToken
            }
          });
        }
      })
      .catch(err =>{
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: {
            error : err
          }
        });
        throw new Error(err);
      })
  }

  @Post('/linkPromCode')
  async linkPromCode(@Res() res, @Body() userPromCodeDTO: UserPromCodeDTO){
    /*Check if the received code exists*/
    this.promotionalCodeService.getCode(userPromCodeDTO.code)
      .then( (code) => {
        if(!code){
          return res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content : {
              message: 'Ups! El código que ingresaste no existe'
            }
          })
        }
        /*Check if the received code is still valid*/
        this.timeService.getPromCodeExpiryConfirmation(code.expirationDate)
          .then( (isValidCode) => {
            if(!isValidCode){
              return res.status(HttpStatus.BAD_REQUEST).json({
                response: 1,
                content : {
                  message: 'Ups! El código que ingresaste ya venció'
                }
              })
            }
            /*Create the teplate of the new user promotional code*/
            let newUserPromCode: UserPromCodeInterface = {
              discount: code.discount, 
              code: code.code, 
              expirationDate: code.expirationDate
            }
            /*Links the received code with a user */
            this.userService.linkPromCodeToUser(userPromCodeDTO.userId ,  newUserPromCode)
              .then( (user) => {
                if(!user){
                  return res.status(HttpStatus.BAD_REQUEST).json({
                    response: 1,
                    content : {
                      message: 'Ups! No pudimos vincular el código a tu cuenta',
                    }
                  })
                }
                return res.status(HttpStatus.OK).json({
                  response: 2,
                  content : {
                    message: 'El código se ha vinculado a tu cuenta correctamente',
                    discount: code.discount,
                    expirationDate: code.expirationDate
                  }
                })
              })
              .catch ( (err) => {
                res.status(HttpStatus.BAD_REQUEST).json({
                  response: 3,
                  content : {
                    message: 'Ups! Ha ocurrido un error'
                  }
                })
                throw new Error(err);
              })

          })
          .catch ( (err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
              response: 3,
              content : {
                message: 'Ups! Ha ocurrido un error'
              }
            })
            throw new Error(err);
          })
      })
      .catch ( (err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content : {
            message: 'Ups! Ha ocurrido un error'
          }
        })
        throw new Error(err);
      })  
  }
  
  /*
    This enpoint create a new user with a phone, email, and name
  */
  @Post('/signUp')
  async signUp(@Res()res, @Body() createUserDTO : CreateUserDTO, @Query('method')method : "APPLE"| "FACEBOOK"| "PHONE"){
    if(!method){
      res.status(HttpStatus.BAD_REQUEST).json({
        response: 3,
        content: {
          message : "Falta el metodo de registro en la query param"
        }
      });
      throw new Error("Falta el metodo de registro en la query param");
    }

    this.userService.createUser(createUserDTO,method)
      .then((user)=>{
        return res.status(HttpStatus.OK).json({
          response: 2,
          content: {
            message : "El usuario se registro correctamente"
          }
        });
      })
      .catch((err)=>{
        res.status(HttpStatus.BAD_REQUEST).json({
          response: 3,
          content: {
            error : err
          }
        });
        throw new Error(err);
      });   
  }

  /*
    This endpoint is used to modify the last conection of user 
  */
  @Put('/lastConnection/update')
  async updateLastConnection(@Res()res,@Query('phone')userPhone : number){
    //search an user with this phone
    const USER : User = await this.userService.getUserByPhone(userPhone);
    //if exists an user with the phoneUser given
    if(USER){
      //update the last conection date
      this.userService.updateLastConnection(USER._id)
        .then(user =>{
          return res.status(HttpStatus.OK).json({
            response: 2,
            content: {
              message : `Propiedad actualizada a ${user.lastConnection}`
            }
          });
        })
        .catch(err=>{
          res.status(HttpStatus.BAD_REQUEST).json({
            response: 1,
            content: {
              error : err
            }
          });
          throw new Error(err);
        })
    //if no exists an user with the given phone
    }else{
      res.status(HttpStatus.BAD_REQUEST).json({
        response: 1,
        content: {
          message : "Ups, no encontramos a un usuario con ese telefono"
        }
      });
      throw new Error("No se encontro un usuario con ese telefono");
    }
  }
}

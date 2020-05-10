//Nest Js Modules
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//Mongoose ORM Database Module COnection
import { MongooseModule } from "@nestjs/mongoose";
//Timugo Barber Users Module
import { UserModule } from './barbers/user/user.module';
/* Timugo Pets Users module */
import { UserPetsModule } from './pets/user-pets/user-pets.module';
//Twilio Notification MOdule
import { TwilioModule } from './modules/twilio/twilio.module';
/** Logs modules */
import { LogBarbersModule } from './barbers/log-barbers/log-barbers.module';
import { LogPetsModule } from './pets/log-pets/log-pets.module';
import { PartnerModule } from './pets/partner/partner.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './pets/products/products.module';
import { ServiceModule } from './pets/service/service.module';
import { BarberModule } from './barbers/barber/barber.module';
import { OrdersModule } from './barbers/orders/orders.module';
import { BarberyServiceModule } from './barbers/barbery-service/barbery-service.module';
import { BarberySeviceController } from './barbers/barbery-service/barbery-sevice.controller';

//Enviroment Variables
require("dotenv").config();
// ============================
//  Enviroment
// ============================
//process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ============================
//  Database
// ============================
//Mongo Databases Urls
let urlMongodbTimugoBarbers : string = "";
let urlMongoDbTimugoPets : string = "";
//If the enviroment is develop or local then make URL string conection TEST DATABASE
if (process.env.ENVIROMENT === 'dev' || process.env.ENVIROMENT === 'local') {
  console.log("Develop or LOCAL MODE");
  urlMongodbTimugoBarbers = process.env.MONGO_URL_BARBERS_TEST;
  urlMongoDbTimugoPets = process.env.MONGO_URL_PETS_TEST;
} else {
  console.log("production mode");
  urlMongodbTimugoBarbers = process.env.MONGO_URL_BARBERS_PRODUCTION;
  urlMongoDbTimugoPets = process.env.MONGO_URL_PETS_PRODUCTION;
}

@Module({
  imports: [
    //IMports All modules like Other routes, payment modules and other stuff
    UserModule,
    UserPetsModule,
    //Twilio SMS notification and Calls MOdule
    TwilioModule,
    //Logs modules
    LogBarbersModule,
    LogPetsModule,
    //MOngoose Databases conections 
    MongooseModule.forRoot(urlMongodbTimugoBarbers, {
      connectionName : 'BarbersMongoDb',
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    MongooseModule.forRoot(urlMongoDbTimugoPets, {
      connectionName : 'PetsMongoDb',
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    PartnerModule,
    AuthModule,
    ProductsModule,
    ServiceModule,
    BarberModule,
    OrdersModule,
    BarberyServiceModule,

  ],
  controllers: [AppController, BarberySeviceController],
  providers: [AppService],
})
export class AppModule { }

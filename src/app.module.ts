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
/* Extra modules */
import { PartnerModule } from './pets/partner/partner.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './pets/products/products.module';
import { ServiceModule } from './pets/service/service.module';
import { BarberModule } from './barbers/barber/barber.module';
import { OrdersBarbersModule } from './barbers/orders/orders.module';
import { BarberyServiceModule } from './barbers/barbery-service/barbery-service.module';
import { OrdersPetsModule } from './pets/orders/orders.module';
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

    /* Barberos Modules */
    UserModule,
    UserPetsModule,
    BarberModule,
    BarberyServiceModule,
    OrdersPetsModule,
    OrdersBarbersModule,
    LogBarbersModule,
    
    /* Pets Modules */
    PartnerModule,
    ProductsModule,
    ServiceModule,
    LogPetsModule,
    
    /* EXTRA modules */
    //Twilio SMS notification and Calls MOdule
    TwilioModule,

    /* Autentication Modules */
    AuthModule,
    
    /* Databases Modules */ 
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

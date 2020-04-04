//Nest Js Modules
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//Mongoose ORM Database Module COnection
import { MongooseModule } from "@nestjs/mongoose";
//Timugo Barber Users Module
import { UserModule } from './user/user.module';
//Enviroment Variables
require("dotenv").config();
// ============================
//  Enviroment
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ============================
//  Database
// ============================
let urlDB: string = "";
//If the enviroment is develop or local then make URL string conection TEST DATABASE
if (process.env.ENVIROMENT === 'dev' || process.env.ENVIROMENT === 'local') {
  console.log("Develop or LOCAL MODE");
  urlDB = process.env.MONGO_URL_TEST;
} else {
  console.log("production mode");
  urlDB = process.env.MONGO_URL;
}

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(urlDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

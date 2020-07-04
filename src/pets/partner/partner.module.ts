/* Nest js Dependencies */
import { Module, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
/* Services */
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
/* Schemas */
import { PartnerSchema } from "./schemas/partner.schema";
/* Extra modules importations */
import { LogPetsModule } from '../log-pets/log-pets.module';
import { ProductsModule } from '../products/products.module';
import { TwilioModule } from 'src/modules/twilio/twilio.module';
import { FilesModule } from 'src/modules/files/infrastructure/files.module';


/* This filter  only accepts certains file types */
// const imageFilter = (req,file,cb) =>{
//   console.log("llegue al filtro");
//   //Filter the image formats
//   if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//     cb( new HttpException(`Unsuported file type ${extname(file.originalname)}`,HttpStatus.BAD_REQUEST),false);
//   }
//   cb(null,true)
// };
@Module({
  imports: [
    MongooseModule.forFeature(
       /*
        Fist paremeter : array with the schemas to save in the database
        the second parameter : name database 
      */
      [
        //If we need more schemas for user module can import here
        {name:"Partner",schema : PartnerSchema}
      ],'PetsMongoDb'),
    // Other module is required need to import here
    LogPetsModule,
    TwilioModule,
    ProductsModule,
    FilesModule,
    PassportModule.register({
      defaultStrategy :'jwt',
      session:false
    }),
    /* File upload module */
    // MulterModule.registerAsync({
    //   useFactory:()=>({
    //     fileFilter : imageFilter 
    //   })
    // }),
    
  ],
  providers: [PartnerService],
  controllers: [PartnerController],
  exports : [PartnerService]
})
export class PartnerModule {}

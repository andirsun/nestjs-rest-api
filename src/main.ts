import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from "./sentry.interceptor";
import { urlencoded, json } from 'express';

require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  //app.use(json({ limit: '50mb' }));
  //app.use(urlencoded({ extended: true, limit: '50mb' }));
  if(process.env.ENVIROMENT == "prod" ){
    //Production enviroment
    /*
      Sentry is the Handler error platform
      first need to init the handler
    */
    Sentry.init({
      dsn: process.env.SENTRY_PRODUCTION_DSN,
    });
    /* 
      Global sentry interceptor for watch all exceptions
      and error in the entire backend
    */
    app.useGlobalInterceptors(new SentryInterceptor());
  }
  /* Default port to run */
  await app.listen(3001);
}
bootstrap();

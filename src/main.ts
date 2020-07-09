import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from "./sentry.interceptor";

require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

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
  await app.listen(process.env.PORT || 3001);
}
bootstrap();

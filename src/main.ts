import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from "./sentry.interceptor";
require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if(process.env.ENVIROMENT == "prod" ){
    //Production enviroment
    /*
      Sentry is the Handler error platform
      first need to init the handler
    */
    Sentry.init({
      dsn: 'https://2cc8cd05168f4b39aaaa2c80274524f3@o384878.ingest.sentry.io/5216817',
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

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from "@nestjs/platform-express";

import * as functions from 'firebase-functions';
import * as express from 'express';

const server = express();

const createNestServer = async (expressInstance ): Promise<void> =>{
  const app =await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );

  await app.init();
}

// createNestServer(server)

//   .then(v => console.log('Nest Ready'))
//   .catch(err => console.log(`Nest Error ${err}`));

//export const api = functions.https.onRequest(server);
export const api = functions.https.onRequest(async (request, response) => {
    await createNestServer(server);
    server(request, response);
  });
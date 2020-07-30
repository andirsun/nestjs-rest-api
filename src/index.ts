/*
  This file is only readed by Firebase Cloud Functions
*/

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

export const api = functions.https.onRequest(async (request, response) => {
    await createNestServer(server);
    server(request, response);
  });
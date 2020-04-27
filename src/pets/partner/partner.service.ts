require("dotenv").config();

import { Injectable } from '@nestjs/common';
/*Moongose Dependencies */ 
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
/* Interfaces */
import { Partner } from "./interfaces/partner.interface";

@Injectable()
export class PartnerService {}

/* Nest Js libraries */
import { Injectable } from '@nestjs/common';
/* Mongoose dependencies */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
/* Dtos */
import { CreateProductDTO } from "./dto/product.dto";
/* Interfaces */
import { Product } from "./interfaces/product.interface";

@Injectable()
export class ProductsService {
  
  constructor(@InjectModel('Products') private readonly productModel : Model<Product>){}
	
	/*
		This funcion create a product with a
		basic info and the id of the owner partner
	*/
  async createProduct(partnerId : string,createProductDTO : CreateProductDTO) : Promise<Product>{
		// Initialize the user with the data transfer object 
		var product = new this.productModel(createProductDTO);
		product.idPartner = partnerId;
		//Return the insert query to be handle in the controller
		return await product.save();
	};
	/*
		This function return a query of db with all
		products found with a particular partnerId
	*/
	async getPartnerProducts(partnerId : string): Promise<Product[]>{
		return await this.productModel.find({idPartner:partnerId});
	}
	/*
		This function return a query of db with a
		specific product
	*/
	async getProduct(productId : string): Promise<Product>{
		return await this.productModel.findOne({_id:productId});
	}
}

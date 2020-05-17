/* Nest Js libraries */
import { Injectable } from '@nestjs/common';
/* Mongoose dependencies */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
/* Dtos */
import { CreateProductDTO } from "./dto/product.dto";
import { CreateProductPresentationDTO } from './dto/productPresentation.dto';
/* Interfaces */
import { Product } from "./interfaces/product.interface";
import { Presentation } from "./interfaces/product.interface";

@Injectable()
export class ProductsService {
  
  constructor(
		@InjectModel('Products') private readonly productModel : Model<Product>,
		@InjectModel('productPresentation') private readonly productPresentationModel : Model<Presentation>
		){}
	
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
		This function create a product presentation
	*/
	async createProductPresentation(productId : string, createProductPresentation : CreateProductPresentationDTO): Promise<Product>{
		/* Create an instance of the produdct presentation to insert in the database */
		let presentation = new this.productPresentationModel(createProductPresentation);
		/* Return the promise with the update query */
		return await this.productModel.findByIdAndUpdate(productId,{$push : {presentations : presentation}},{new : true});
	}
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
	/*
		This function return a query of db with a
		products under specific tag
	*/
	async getProductsByTag(tag : string): Promise<Product[]>{
		return await this.productModel.find({tags : {$in : [tag]}});
	}
	/*
		This function associate a url to product
	*/
	async addUrlImgToProduct(idProduct : string,urlImg : string) :Promise<Product>{
		return await this.productModel.findOneAndUpdate({_id : idProduct},{img : urlImg});
	}
	/*
		This function associate a url to product presentation
	*/
	async addUrlImgToPresentation(idProduct : string,urlImg : string):Promise<Product>{
		/* Select the product to get presentations */
		let product : Product = await this.productModel.findOne({_id : idProduct});
		/* If the product exits, then add url img to the last presentation created */
		if(product){
			product.presentations[product.presentations.length-1].urlImg = urlImg;
		}
		return await product.save();
	}
	/*
		Add Tag to Product
	*/
	async addTagToProduct(idProduct : string,tag : string) :Promise<Product>{
		return await this.productModel.findOneAndUpdate({_id : idProduct},{$push :{tags: tag}});
	}
}

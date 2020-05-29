/* Nest Js dependencies */
import { Controller, Get, Res, Query, HttpStatus } from '@nestjs/common';
/* Services */
import { ProductsService } from './products.service';
import { CreateQueryDTO } from './dto/query.dto';

@Controller('products')
export class ProductsController {
  
  constructor(
    private productService : ProductsService,
  ){}
  
  @Get('/search')
	async checkUser(@Res()res, @Query('query')query :string){
    /* BUild the query object to create */
    let createQueryDTO : CreateQueryDTO ={
      query : query
    }
    /* Create the query in the database */
    this.productService.searchProductsOrServices(createQueryDTO)
      .then(query=>{
        /* Success  */
        return res.status(HttpStatus.OK).json({
					response: 2,
					content:{
						query
					}
				});
      })
      .catch(err=>{
        /* Error */
        res.status(HttpStatus.BAD_REQUEST).json({
					response: 1,
					content:{
						message : "error al buscar"
					}
				});
        throw new Error(err);
      })
    
	}
}

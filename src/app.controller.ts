import { Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
             ) {}

  @Get()
  getHello(): string { 
    return this.appService.getHello();
  }

  /*  Redirect to other url*/
	// @Get('/docs')
	// @Redirect('https://fb.com', 302)
	// getDocs() {
	// 		return { url: 'https://docs.nestjs.com/v5/' };
		
	// }
}

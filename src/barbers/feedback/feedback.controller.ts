/*Nest dependences */
import { Controller, Post, Get, Res, Body, HttpStatus } from '@nestjs/common';
/* services*/ 
import { FeedbackService } from './feedback.service';
import { UserService } from '../user/user.service';
/* Dtos */
import {FeedbackCreateDTO } from './dto/feedback.dto';


@Controller('feedback')
export class FeedbackController{

	constructor( 
		private feedbackService: FeedbackService,
		private userService : UserService    
	){}

  @Get('/all')
  
  /*Get all fedbacks from DB*/
	async getAllFedbacks(@Res() res){
			this.feedbackService.getAllFeedbacks()
					.then((feedbacks)=>{
						console.log("Promise resolved in controller");
						if(feedbacks.length == 0){
							return res.status(HttpStatus.BAD_REQUEST).json({
								response: 1,
								content: {
									message: 'there is no feedbacks'
								}
							});
						}else{
							return res.status(HttpStatus.OK).json({
								response: 2,
								content: {
									feedbacks
								}
							});
						}
					})
					.catch((err)=>{
						console.log("Promise rejected in controller");
						return res.status(HttpStatus.BAD_REQUEST).json({
							response: 3,
							content: {
									err
							}
						});
				});			
	}

  /*Create a new Feedback in DB*/
	@Post('/create')
	async giveFeedback(@Res() res, @Body() body : FeedbackCreateDTO){ 
		const user = await this.userService.getUserByPhone(body.phoneUser);
		/*User not found*/ 
		if(!user){
			return res.status(HttpStatus.BAD_REQUEST).json({
				response: 3,
				content: {
						message : "usuario no encontrado"
				}
			});
		}else {
			this.feedbackService.giveFeedback(user._id,user.name, body.comment)
				.then((feedback)=>{
					console.log("Promise resolved in controller");
					return res.status(HttpStatus.OK).json({
						response: 2,
						content: feedback
					});
				})
				.catch((err)=>{
					console.log("Promise rejected in controller");
					return res.status(HttpStatus.BAD_REQUEST).json({
						response: 3,
						content: {
								err
						}
					});
			});

		}
	}

}

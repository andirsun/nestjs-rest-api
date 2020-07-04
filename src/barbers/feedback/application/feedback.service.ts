/* Nest js dependencies */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
/* Respositories */
import { Feedback } from '../domain/interfaces/feedback.interfaces';



@Injectable()
export class FeedbackService{

	constructor(
		@InjectModel('feedbacks') private readonly feedbackModel: Model <Feedback>,
	){}

	async getAllFeedbacks(): Promise<Feedback[]>{
    const feedbacks = this.feedbackModel.find({})
    return feedbacks;
	}

	async giveFeedback(userId: string, nameUser : string, comment:string): Promise<Feedback>{
		const feedback = new this.feedbackModel({
			idUser : userId,
			nameUser : nameUser,
			feedback: comment
		})
		return feedback.save()
	}

}
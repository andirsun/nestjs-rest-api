import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './interfaces/feedback.interfaces'



@Injectable()
export class FeedbackService{

    //Inyectamos los modelos
    constructor(
        @InjectModel('feedbacks') private readonly feedbackModel: Model <Feedback>,
    ){}

    async giveFeedback(userId: string, nameUser : string, comment:string): Promise<Feedback>{
        //Inicializamos el modelo y obtenemos un documento
        const feedback = new this.feedbackModel({
            idUser : userId,
            nameUser : nameUser,
            feedback: comment
        })
        return feedback.save()
    }

}
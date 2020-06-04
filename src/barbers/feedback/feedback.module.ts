import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from './schema/feedback.schema';
import { FeedbackService } from './feedback.service';
import { FeedbackController }  from './feedback.controller'
import { UserModule } from '../user/user.module';


@Module({
    imports: [
        //Registro los esquemas e indica la base de datos
        MongooseModule.forFeature(
            [
                {name: 'feedbacks', schema: FeedbackSchema}
            ], 'BarbersMongoDb'),
        UserModule
    ],
    controllers:[FeedbackController],
    providers: [FeedbackService],
    exports:[FeedbackService]

})

export class FeedbackModule{}
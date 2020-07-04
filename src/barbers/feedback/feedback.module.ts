/* Nest js dependencies */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
/* Schemas */
import { FeedbackSchema } from './schema/feedback.schema';
/* Services */
import { FeedbackService } from './feedback.service';
/* Controllers */
import { FeedbackController }  from './feedback.controller'
/* Modules */
import { UserModule } from '../user/infrastructure/user.module';


@Module({
    imports: [
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
import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ResponseModel } from '../utils/responseModel';
import { IFeedbackServices } from '../interfaces/feedback/IFeedbackServices';
import mongoose from 'mongoose';
import FeedbackModel from '../models/feedback';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;


export class FeedbackController {

    constructor(private FeedbackService: IFeedbackServices) { }

    async createFeedback(req: Request, res: Response): Promise<Response | void> {
        try {
            const { userId, role, rating, comment } = req.body;

            if (!userId || !role || !rating || !comment) {
                return res.status(BAD_REQUEST).json(ResponseModel.error('Missing required fields'));
            }

            const isUserAlreadySubmitted = await this.FeedbackService.submittedAlready(userId)
            
            if(isUserAlreadySubmitted){
                return res.status(BAD_REQUEST).json(ResponseModel.error('User Already submitted a feedback'))
            }

            const feedbackData = new FeedbackModel({
                userId: new mongoose.Types.ObjectId(userId),
                role,
                rating,
                feedback: comment
            });


            const createdFeedback = await this.FeedbackService.createFeedback(feedbackData);

            return res.status(OK).json(ResponseModel.success('Feedback created successfully', createdFeedback));


        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error'))
        }
    }






}

export default FeedbackController;


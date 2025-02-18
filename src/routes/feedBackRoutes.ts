import express from 'express';
import feedbackRepository from '../repositories/feedbackRepository';
import feedbackServices from '../services/feedbackServices';
import FeedbackController from '../controllers/feedbackController';




const feedbackRep = new feedbackRepository()
const feedbackSer = new feedbackServices(feedbackRep)
const feedbackController = new FeedbackController(feedbackSer)

const feedbackRouter = express.Router();

feedbackRouter
    .post('/createFeedback', (req, res) => {
        feedbackController.createFeedback(req,res)
    })




export default feedbackRouter;

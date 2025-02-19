import express from 'express';
import feedbackRepository from '../repositories/feedbackRepository';
import feedbackServices from '../services/feedbackServices';
import FeedbackController from '../controllers/feedbackController';
import userAuth from '../middleware/userAuthMiddleware';




const feedbackRep = new feedbackRepository()
const feedbackSer = new feedbackServices(feedbackRep)
const feedbackController = new FeedbackController(feedbackSer)

const feedbackRouter = express.Router();

feedbackRouter
    .post('/createFeedback', (req, res) => { feedbackController.createFeedback(req,res)})
    .get('/feedback/:userId',userAuth,(req,res)=>{feedbackController.getMyFeedback(req,res)})
    .delete('/feedback/:feedbackId',userAuth,(req,res)=>{feedbackController.deleteFeedback(req,res)})
    .put('/feedback/:feedbackId',userAuth,(req,res)=>{feedbackController.updateFeedback(req,res)})




export default feedbackRouter;

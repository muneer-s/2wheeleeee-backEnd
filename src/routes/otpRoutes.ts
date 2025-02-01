import express from 'express';
import OtpController from '../controllers/otpController';
import OtpServices from '../services/otpServices';
import OtpRepository from '../repositories/otpRepository';



const otpRepository = new OtpRepository();
const service = new OtpServices(otpRepository)
const otpController = new OtpController(service)
const otpRouter = express.Router();





otpRouter
  .post('/verifyOtp', (req, res) => {
    console.log(`otp is ${req.body.otp}`);
    otpController.verifyOtp(req, res);
  })
  .post('/resendOtp', (req, res) => {
    otpController.resendOtp(req, res);
  });





export default otpRouter;

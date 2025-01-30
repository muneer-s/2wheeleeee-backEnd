import express from 'express';
import OtpController from '../controllers/otpController';
import OtpServices from '../services/otpServices';
import OtpRepository from '../repositories/otpRepository';
import orderRepository from '../repositories/orderRepository';
import orderServices from '../services/orderServices';
import OrderController from '../controllers/orderController';
import userAuth from '../middleware/userAuthMiddleware';



// const otpRepository = new OtpRepository();
// const service = new OtpServices(otpRepository)
// const otpController = new OtpController(service)
// const orderRouter = express.Router();


const OrderRepository = new orderRepository()
const orderService = new orderServices(OrderRepository)
const orderController = new OrderController(orderService)

const orderRouter = express.Router()



// orderRouter
//   .post('/verifyOtp', (req, res) => {
//     console.log(`otp is ${req.body.otp}`);
//     otpController.verifyOtp(req, res);
//   })
//   .post('/resendOtp', (req, res) => {
//     otpController.resendOtp(req, res);
//   });

orderRouter
    .post('/placeOrder',userAuth, (req, res) => { orderController.saveOrder(req, res)})





export default orderRouter;


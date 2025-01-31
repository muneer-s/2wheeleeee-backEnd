import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";

import { IOrderService } from '../interfaces/order/IOrderService';
import { ResponseModel } from '../utils/responseModel';
import OrderModel from '../models/orderModel';
import razorpay from '../config/razorpayConfig';
import { IWalletService } from '../interfaces/wallet/IWalletService';
import { IUserService } from '../interfaces/user/IUserService';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;


export class OrderController {

    constructor(private OrderServices: IOrderService,private walletServices:IWalletService,private userService: IUserService) { }

    async createOrder(req: Request, res: Response): Promise<Response | void> {
        try {
            const { amount, currency } = req.body;

            const options = {
                amount: amount * 100,
                currency: currency || "INR",
                receipt: `receipt_${Date.now()}`,
            };

            const order = await razorpay.orders.create(options);

            res.status(OK).json({success: true,orderId: order.id,amount: order.amount,currency: order.currency});

        } catch (error:any) {
            console.error("Error creating Razorpay order:", error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Payment failed" });
        }
    }

    async saveOrder(req: Request, res: Response): Promise<Response | void> {
        try {
            const { bikeId, userId, startDate, endDate, paymentMethod, bikePrize,email } = req.body;

            if (!bikeId || !userId || !startDate || !endDate || !paymentMethod) {
                return res.status(NOT_FOUND).json(ResponseModel.error("All fields are required"));
            }

            const status = "Completed"

            const start = new Date(startDate);
            const end = new Date(endDate);
            const numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const total = numDays * bikePrize;

            if(paymentMethod == "wallet"){
                const user = await this.userService.findUserByEmail(email)
                if(!user?.wallet){
                    return res.status(NOT_FOUND).json(ResponseModel.error('user not found'))
                }
    
                const wallet = await this.walletServices.getWallet(user?.wallet.toString())
    
                if(wallet.balance < total){
                    return res.status(BAD_REQUEST).json(ResponseModel.error('Total amount is greater than the wallet balance !!!'))
                }
            }

            const newOrder = new OrderModel({
                bikeId,
                userId,
                startDate,
                endDate,
                method: paymentMethod,
                amount: total,
                status
            });

            const orderPlaced = await this.OrderServices.saveOrder(newOrder)
            return res.status(OK).json(ResponseModel.success("Order placed successfully", { order: orderPlaced }))
        } catch (error) {
            console.error("Error placing order:", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
        }
    }



}

export default OrderController;


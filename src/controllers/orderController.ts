import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";

import { IOrderService } from '../interfaces/order/IOrderService';
import { ResponseModel } from '../utils/responseModel';
import OrderModel from '../models/orderModel';
import { error } from 'console';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;


export class OrderController {

    constructor(private OrderServices: IOrderService) { }


    // async verifyOtp(req: Request, res: Response): Promise<Response | void> {
    //     try {
    //         let data = req.body

    //         const otpMatched = await this.OtpServices.verifyOtp(data)


    //         } else {
    //             return res.status(BAD_REQUEST).json(ResponseModel.error('OTP verification failed! No matching OTP'));
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
    //     }
    // }

    async saveOrder(req: Request, res: Response): Promise<Response | void> {
        try {

            const { bikeId, userId, startDate, endDate, paymentMethod } = req.body;
            console.log(11, bikeId)
            console.log(22, userId)
            console.log(333, startDate)
            console.log(444, endDate)
            console.log(555, paymentMethod)
            //Validate required fields
            if (!bikeId || !userId || !startDate || !endDate || !paymentMethod) {
                return res.status(NOT_FOUND).json(ResponseModel.error("All fields are required"));
            }

            const amount = 1000

            const status = "pending"

            const newOrder = new OrderModel({
                bikeId,
                userId,
                startDate,
                endDate,
                method: paymentMethod,
                amount,
                status
            });

            const orderPlaced = await this.OrderServices.saveOrder(newOrder)
            return res.status(OK).json(ResponseModel.success("Order placed successfully", {order: orderPlaced }))
        } catch (error) {
            console.error("Error placing order:", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
        }
    }



}

export default OrderController;


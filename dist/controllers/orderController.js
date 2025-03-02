"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const responseModel_1 = require("../utils/responseModel");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const razorpayConfig_1 = __importDefault(require("../config/razorpayConfig"));
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatusCodes_1.STATUS_CODES;
class OrderController {
    constructor(OrderServices, walletServices, userService) {
        this.OrderServices = OrderServices;
        this.walletServices = walletServices;
        this.userService = userService;
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { amount, currency } = req.body;
                amount = amount + 150;
                const options = {
                    amount: amount * 100,
                    currency: currency || "INR",
                    receipt: `receipt_${Date.now()}`,
                };
                const order = yield razorpayConfig_1.default.orders.create(options);
                res.status(OK).json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency });
            }
            catch (error) {
                console.error("Error creating Razorpay order:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Payment failed" });
            }
        });
    }
    saveOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { bikeId, userId, startDate, endDate, paymentMethod, bikePrize, email } = req.body;
                if (!bikeId || !userId || !startDate || !endDate || !paymentMethod) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("All fields are required"));
                }
                const findBike = yield this.OrderServices.findBike(bikeId);
                const ownerId = findBike === null || findBike === void 0 ? void 0 : findBike.userId;
                const status = "Booked";
                const start = new Date(startDate);
                const end = new Date(endDate);
                const numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                var total = 0;
                var bikeRent = 0;
                if (findBike === null || findBike === void 0 ? void 0 : findBike.offerApplied) {
                    total = numDays * ((_a = findBike.offerPrice) !== null && _a !== void 0 ? _a : bikePrize);
                    bikeRent = (_b = findBike.offerPrice) !== null && _b !== void 0 ? _b : bikePrize;
                }
                else {
                    total = numDays * bikePrize;
                    bikeRent = bikePrize;
                }
                total = total + 150;
                if (paymentMethod == "wallet") {
                    const user = yield this.userService.findUserByEmail(email);
                    if (!(user === null || user === void 0 ? void 0 : user.wallet)) {
                        return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error('user not found'));
                    }
                    const wallet = yield this.walletServices.getWallet(user === null || user === void 0 ? void 0 : user.wallet.toString());
                    if (wallet.balance < total) {
                        return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('Total amount is greater than the wallet balance !!!'));
                    }
                    const newBalance = wallet.balance - total;
                    yield this.walletServices.saveWallet(wallet._id.toString(), newBalance, total, bikeId);
                }
                const newOrder = new orderModel_1.default({
                    bikeId,
                    userId,
                    startDate,
                    endDate,
                    method: paymentMethod,
                    amount: total,
                    status,
                    ownerId,
                    orderTimeBikeRent: bikeRent
                });
                const orderPlaced = yield this.OrderServices.saveOrder(newOrder);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Order placed successfully", { order: orderPlaced }));
            }
            catch (error) {
                console.error("Error placing order:", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error', error));
            }
        });
    }
    completeOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const findOrder = yield this.OrderServices.findOrder(orderId);
                if (!findOrder) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("There is no such an order"));
                }
                if (findOrder.status === "Early Return") {
                    const { endDate, updatedAt, orderTimeBikeRent, userId } = findOrder;
                    const endTimestamp = new Date(endDate).getTime();
                    const updateTimestamp = new Date(updatedAt).getTime();
                    const restDays = Math.max(0, Math.ceil((endTimestamp - updateTimestamp) / (1000 * 60 * 60 * 24)));
                    const refundAmount = restDays * orderTimeBikeRent;
                    const findUser = yield this.OrderServices.findUser(userId.toString());
                    const walletId = findUser.wallet;
                    yield this.OrderServices.addBalance(walletId.toString(), refundAmount);
                }
                const updatedOrder = yield this.OrderServices.completeOrder(orderId);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Order status updated successfully", updatedOrder));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
}
exports.OrderController = OrderController;
exports.default = OrderController;

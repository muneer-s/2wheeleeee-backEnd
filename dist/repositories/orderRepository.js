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
const baseRepository_1 = __importDefault(require("./baseRepository"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const bikeModel_1 = __importDefault(require("../models/bikeModel"));
const console_1 = require("console");
const walletModel_1 = __importDefault(require("../models/walletModel"));
const userModels_1 = __importDefault(require("../models/userModels"));
class orderRepository {
    constructor() {
        this.orderRepository = new baseRepository_1.default(orderModel_1.default);
        this.bikeRepository = new baseRepository_1.default(bikeModel_1.default);
        this.walletRepository = new baseRepository_1.default(walletModel_1.default);
        this.userRepository = new baseRepository_1.default(userModels_1.default);
    }
    saveOrder(newOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Order = yield this.orderRepository.create(newOrder);
                return Order;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    findBike(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bike = yield this.bikeRepository.findById(bikeId);
                if (!bike) {
                    return null;
                }
                return bike;
            }
            catch (error) {
                console.log("error in order repository find bike owner", error);
                throw error;
            }
        });
    }
    findOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.orderRepository.findOne({ _id: orderId });
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user)
                    throw console_1.error;
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addBalance(walletId, refundAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
                    $inc: { balance: refundAmount },
                    $push: {
                        history: {
                            date: new Date(),
                            type: "credit",
                            amount: refundAmount,
                            reason: "Early Return"
                        }
                    }
                };
                const a = yield this.walletRepository.updateOne({ _id: walletId }, updateData);
                const wallet = this.walletRepository.findOne({ _id: walletId });
                if (!wallet) {
                    throw new Error("wallet not found");
                }
                return wallet;
            }
            catch (error) {
                throw error;
            }
        });
    }
    completeOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.orderRepository.findOneAndUpdate({ _id: orderId }, { status: "Completed" }, { new: true });
                if (!result) {
                    throw new Error("Error while return early");
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = orderRepository;

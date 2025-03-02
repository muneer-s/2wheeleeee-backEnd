"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderRepository_1 = __importDefault(require("../repositories/orderRepository"));
const orderServices_1 = __importDefault(require("../services/orderServices"));
const orderController_1 = __importDefault(require("../controllers/orderController"));
const userAuthMiddleware_1 = __importDefault(require("../Middleware/userAuthMiddleware"));
const walletRepository_1 = __importDefault(require("../repositories/walletRepository"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const walletServices_1 = __importDefault(require("../services/walletServices"));
const userServices_1 = __importDefault(require("../services/userServices"));
const walletRep = new walletRepository_1.default();
const userRep = new userRepository_1.default();
const walletSer = new walletServices_1.default(walletRep);
const userSer = new userServices_1.default(userRep);
const OrderRepository = new orderRepository_1.default();
const orderService = new orderServices_1.default(OrderRepository);
const orderController = new orderController_1.default(orderService, walletSer, userSer);
const orderRouter = express_1.default.Router();
orderRouter
    .post('/createOrder', userAuthMiddleware_1.default, (req, res) => { orderController.createOrder(req, res); })
    .post('/placeOrder', userAuthMiddleware_1.default, (req, res) => { orderController.saveOrder(req, res); })
    .put('/completeOrder/:orderId', userAuthMiddleware_1.default, (req, res) => { orderController.completeOrder(req, res); });
exports.default = orderRouter;

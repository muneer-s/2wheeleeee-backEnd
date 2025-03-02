"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageRepository_1 = __importDefault(require("../repositories/messageRepository"));
const messageServices_1 = __importDefault(require("../services/messageServices"));
const messageController_1 = __importDefault(require("../controllers/messageController"));
const userAuthMiddleware_1 = __importDefault(require("../middleware/userAuthMiddleware"));
const chatRepository_1 = __importDefault(require("../repositories/chatRepository"));
const messageRep = new messageRepository_1.default();
const chatRep = new chatRepository_1.default();
const messageSer = new messageServices_1.default(messageRep, chatRep);
const messageController = new messageController_1.default(messageSer);
const messageRouter = express_1.default.Router();
messageRouter
    .post('/sendmessage', userAuthMiddleware_1.default, (req, res) => { messageController.sendMessage(req, res); })
    .get('/getallmessage', userAuthMiddleware_1.default, (req, res) => { messageController.getMessage(req, res); });
exports.default = messageRouter;

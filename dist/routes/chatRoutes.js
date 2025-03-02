"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatRepository_1 = __importDefault(require("../repositories/chatRepository"));
const chatServices_1 = __importDefault(require("../services/chatServices"));
const chatController_1 = __importDefault(require("../controllers/chatController"));
const userAuthMiddleware_1 = __importDefault(require("../middleware/userAuthMiddleware"));
const chatRep = new chatRepository_1.default();
const chatSer = new chatServices_1.default(chatRep);
const chatController = new chatController_1.default(chatSer);
const chatRouter = express_1.default.Router();
chatRouter
    .get('/getchat', userAuthMiddleware_1.default, (req, res) => { chatController.getChat(req, res); })
    .post('/accesschat', userAuthMiddleware_1.default, (req, res) => { chatController.accessChat(req, res); });
exports.default = chatRouter;

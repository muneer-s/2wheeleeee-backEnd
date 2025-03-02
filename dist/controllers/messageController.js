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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const responseModel_1 = require("../utils/responseModel");
const socket_1 = require("../socket/socket");
const { INTERNAL_SERVER_ERROR } = httpStatusCodes_1.STATUS_CODES;
class MessageController {
    constructor(MessageServices) {
        this.MessageServices = MessageServices;
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, senderId, content } = req.body;
                if (!chatId || !senderId || !content) {
                    return res.status(400).json({ error: "Invalid message data" });
                }
                const newMessage = yield this.MessageServices.sendMessage(chatId, senderId, content);
                socket_1.io.emit("message received", newMessage);
                res.json(newMessage);
            }
            catch (error) {
                console.error('error while send message', error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("INTERNAL SERVER ERROR", error));
            }
        });
    }
    getMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = req.query.userChatId;
                const message = yield this.MessageServices.getMessage(chatId);
                res.json(message);
            }
            catch (error) {
                console.error('error while fetching messages', error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("INTERNAL SERVER ERROR", error));
            }
        });
    }
}
exports.MessageController = MessageController;
exports.default = MessageController;

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
exports.ChatController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const responseModel_1 = require("../utils/responseModel");
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatusCodes_1.STATUS_CODES;
class ChatController {
    constructor(ChatServices) {
        this.ChatServices = ChatServices;
    }
    accessChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { receiverId, senderId } = req.body;
                const chat = yield this.ChatServices.accessChat(receiverId, senderId);
                // res.json(chat)
                return res.status(OK).json(responseModel_1.ResponseModel.success("Access chat ", chat));
            }
            catch (error) {
                console.error('error in creating chat room', error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("INTERNAL SERVER ERROR", error));
            }
        });
    }
    getChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                console.log('userid kiti', userId);
                const messages = yield this.ChatServices.getChat(userId);
                console.log(111, messages);
                res.json(messages);
            }
            catch (error) {
                console.error('erron while fetching message details', error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("INTERNAL SERVER ERROR", error));
            }
        });
    }
}
exports.ChatController = ChatController;
exports.default = ChatController;

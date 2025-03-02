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
const mongoose_1 = require("mongoose");
class messageServices {
    constructor(messageRepository, chatRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
    }
    sendMessage(chatId, senderId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = {
                    sender: senderId,
                    chat: chatId,
                    content
                };
                const message = yield this.messageRepository.sendMessage(newMessage);
                if (!message) {
                    return null;
                }
                const messageId = new mongoose_1.Types.ObjectId(message._id);
                const latestMessage = yield this.chatRepository.latestMessage(chatId, messageId);
                if (!latestMessage) {
                    return null;
                }
                return message;
            }
            catch (error) {
                console.error('error in sending message', error);
            }
        });
    }
    getMessage(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.messageRepository.getMessage(chatId);
            }
            catch (error) {
                console.error('error while fetching message list', error);
            }
        });
    }
}
exports.default = messageServices;

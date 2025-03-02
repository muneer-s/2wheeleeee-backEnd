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
const messageModel_1 = __importDefault(require("../models/messageModel"));
class messageRepository {
    constructor() {
        this.messageRepository = new baseRepository_1.default(messageModel_1.default);
    }
    sendMessage(newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let message = yield this.messageRepository.create(newMessage);
                message = yield message.populate("sender", "name email profile_picture");
                message = yield message.populate("chat");
                return message;
            }
            catch (error) {
                console.error("error in sending message:", error);
                throw error;
            }
        });
    }
    getMessage(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.messageRepository.getModel()
                    .find({ chat: chatId })
                    .populate("sender", "name email")
                    .populate("chat")
                    .exec();
                return messages;
            }
            catch (error) {
                console.error('error in getting message:', error);
                throw error;
            }
        });
    }
}
exports.default = messageRepository;

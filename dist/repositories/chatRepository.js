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
const chatModel_1 = __importDefault(require("../models/chatModel"));
class chatRepository {
    constructor() {
        this.chatRepository = new baseRepository_1.default(chatModel_1.default);
    }
    checkChat(receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let checkChat = yield this.chatRepository.findOne({
                    $and: [
                        { users: { $elemMatch: { $eq: senderId } } },
                        { users: { $elemMatch: { $eq: receiverId } } },
                    ],
                });
                if (checkChat) {
                    yield checkChat.populate({ path: "users", select: "name email" });
                    yield checkChat.populate({
                        path: "latestMessage.sender",
                        select: "name email",
                    });
                }
                return checkChat;
            }
            catch (error) {
                console.error("error in finding chat:", error);
                throw error;
            }
        });
    }
    createChat(receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.create({
                    users: [senderId, receiverId],
                });
            }
            catch (error) {
                console.error("error in creating chat:", error);
                throw error;
            }
        });
    }
    getChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.chatRepository.findChat({
                    users: { $elemMatch: { $eq: userId } },
                })
                    .populate({ path: "users", select: "name email profile_picture" })
                    .populate("latestMessage")
                    .sort({ updatedAt: -1 });
                return result;
            }
            catch (error) {
                console.error("error in getting chat:", error);
                throw error;
            }
        });
    }
    latestMessage(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.findByIdAndUpdate(chatId, {
                    latestMessage: message,
                });
            }
            catch (error) {
                console.error("error in updating latest message:", error);
                throw error;
            }
        });
    }
}
exports.default = chatRepository;

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
class chatServices {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    accessChat(receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chat = yield this.chatRepository.checkChat(receiverId, senderId);
                console.log('chat illa', chat);
                if (!chat) {
                    console.log('chat illengil');
                    const createChat = yield this.chatRepository.createChat(receiverId, senderId);
                    chat = yield this.chatRepository.checkChat(receiverId, senderId);
                }
                console.log('ipo chat vanno ', chat);
                return chat;
            }
            catch (error) {
                console.error('error in sending message', error);
            }
        });
    }
    getChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chats = yield this.chatRepository.getChat(userId);
                if (!chats) {
                    return null;
                }
                chats = chats === null || chats === void 0 ? void 0 : chats.map(chat => {
                    const chatObject = chat.toObject();
                    chatObject.users = chatObject.users.filter((user) => user._id.toString() !== userId);
                    return chatObject;
                });
                return chats;
            }
            catch (error) {
                console.error('error while fetching messages', error);
            }
        });
    }
}
exports.default = chatServices;

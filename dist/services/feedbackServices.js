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
class feedbackServices {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    createFeedback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.createFeedback(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    submittedAlready(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.submittedAlready(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    myFeedback(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.myFeedback(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteFeedback(feedbackId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.deleteFeedback(feedbackId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateFeedback(feedbackId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.updateFeedback(feedbackId, data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    allFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.allFeedbacks();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = feedbackServices;

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
const feedback_1 = __importDefault(require("../models/feedback"));
const mongoose_1 = __importDefault(require("mongoose"));
class feedbackRepository {
    constructor() {
        this.feedbackRepository = new baseRepository_1.default(feedback_1.default);
    }
    createFeedback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.create(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    submittedAlready(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.findOne({ userId: userId });
            }
            catch (error) {
                throw error;
            }
        });
    }
    myFeedback(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = new mongoose_1.default.Types.ObjectId(userId);
                return yield this.feedbackRepository.findOne({ userId: id });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteFeedback(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.findByIdAndDelete(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateFeedback(feedbackId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.findByIdAndUpdate(feedbackId, data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    allFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.findFeedback();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = feedbackRepository;

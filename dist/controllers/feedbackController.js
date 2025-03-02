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
exports.FeedbackController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const responseModel_1 = require("../utils/responseModel");
const mongoose_1 = __importDefault(require("mongoose"));
const feedback_1 = __importDefault(require("../models/feedback"));
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatusCodes_1.STATUS_CODES;
class FeedbackController {
    constructor(FeedbackService) {
        this.FeedbackService = FeedbackService;
    }
    createFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, rating, comment } = req.body;
                if (!userId || !rating || !comment) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('Missing required fields'));
                }
                const isUserAlreadySubmitted = yield this.FeedbackService.submittedAlready(userId);
                if (isUserAlreadySubmitted) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('User Already submitted a feedback'));
                }
                const feedbackData = new feedback_1.default({
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    rating,
                    feedback: comment
                });
                const createdFeedback = yield this.FeedbackService.createFeedback(feedbackData);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Feedback created successfully', createdFeedback));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error'));
            }
        });
    }
    deleteFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedbackId = req.params.feedbackId;
                if (!feedbackId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("feedback id is missing"));
                }
                const deletedFeedback = yield this.FeedbackService.deleteFeedback(feedbackId);
                if (!deletedFeedback) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("No Feedback Found"));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success("Feedback deleted"));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error'));
            }
        });
    }
    getMyFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (!userId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("User id is missing"));
                }
                const feedback = yield this.FeedbackService.myFeedback(userId);
                if (!feedback) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("No feedback found"));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success('Feedback successfully get', feedback));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error'));
            }
        });
    }
    updateFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rating, comment } = req.body;
                const feedbackId = req.params.feedbackId;
                const data = {
                    rating: rating,
                    feedback: comment
                };
                const updatedFeedback = yield this.FeedbackService.updateFeedback(feedbackId, data);
                if (!updatedFeedback) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("Feedback not found"));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success("Feedback updated successfully", updatedFeedback));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error'));
            }
        });
    }
    getAllFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allFeedbacks = yield this.FeedbackService.allFeedbacks();
                return res.status(OK).json(responseModel_1.ResponseModel.success('Get all feedbacks', allFeedbacks));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error'));
            }
        });
    }
}
exports.FeedbackController = FeedbackController;
exports.default = FeedbackController;

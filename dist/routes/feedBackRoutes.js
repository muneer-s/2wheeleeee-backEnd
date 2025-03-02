"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbackRepository_1 = __importDefault(require("../repositories/feedbackRepository"));
const feedbackServices_1 = __importDefault(require("../services/feedbackServices"));
const feedbackController_1 = __importDefault(require("../controllers/feedbackController"));
const userAuthMiddleware_1 = __importDefault(require("../middleware/userAuthMiddleware"));
const feedbackRep = new feedbackRepository_1.default();
const feedbackSer = new feedbackServices_1.default(feedbackRep);
const feedbackController = new feedbackController_1.default(feedbackSer);
const feedbackRouter = express_1.default.Router();
feedbackRouter
    .post('/createFeedback', (req, res) => { feedbackController.createFeedback(req, res); })
    .get('/feedback/:userId', userAuthMiddleware_1.default, (req, res) => { feedbackController.getMyFeedback(req, res); })
    .delete('/feedback/:feedbackId', userAuthMiddleware_1.default, (req, res) => { feedbackController.deleteFeedback(req, res); })
    .put('/feedback/:feedbackId', userAuthMiddleware_1.default, (req, res) => { feedbackController.updateFeedback(req, res); })
    .get('/allFeedbacks', (req, res) => { feedbackController.getAllFeedback(req, res); });
exports.default = feedbackRouter;

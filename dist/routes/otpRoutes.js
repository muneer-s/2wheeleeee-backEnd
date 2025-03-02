"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const otpController_1 = __importDefault(require("../controllers/otpController"));
const otpServices_1 = __importDefault(require("../services/otpServices"));
const otpRepository_1 = __importDefault(require("../repositories/otpRepository"));
const otpRepository = new otpRepository_1.default();
const service = new otpServices_1.default(otpRepository);
const otpController = new otpController_1.default(service);
const otpRouter = express_1.default.Router();
otpRouter
    .post('/verifyOtp', (req, res) => { otpController.verifyOtp(req, res); })
    .post('/resendOtp', (req, res) => { otpController.resendOtp(req, res); });
exports.default = otpRouter;

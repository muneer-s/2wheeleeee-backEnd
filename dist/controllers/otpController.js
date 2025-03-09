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
exports.OtpController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const userModels_1 = __importDefault(require("../models/userModels"));
const generateToken_1 = require("../utils/generateToken");
const responseModel_1 = require("../utils/responseModel");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatusCodes_1.STATUS_CODES;
const jwtHandler = new generateToken_1.CreateJWT();
class OtpController {
    constructor(OtpServices) {
        this.OtpServices = OtpServices;
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                const otpMatched = yield this.OtpServices.verifyOtp(data);
                if (otpMatched) {
                    const userEmail = data.userId;
                    let userDetails = yield userModels_1.default.findOne({ email: userEmail }, 'email name profile_picture _id');
                    if (!userDetails) {
                        return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('User not found!'));
                    }
                    const time = this.milliseconds(0, 30, 0);
                    const refreshTokenExpiryTime = this.milliseconds(48, 0, 0);
                    const userAccessToken = jwtHandler.generateToken(userDetails === null || userDetails === void 0 ? void 0 : userDetails._id.toString());
                    const userRefreshToken = jwtHandler.generateRefreshToken(userDetails === null || userDetails === void 0 ? void 0 : userDetails._id.toString());
                    return res.status(OK).cookie('user_access_token', userAccessToken, {
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: 'none', // Allows cross-site cookies
                        secure: process.env.NODE_ENV === 'production' ? true : false,
                        httpOnly: true,
                        domain: '.2wheleeee.store'
                    }).cookie('user_refresh_token', userRefreshToken, {
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: 'none',
                        secure: process.env.NODE_ENV === 'production' ? true : false,
                        httpOnly: true,
                        domain: '.2wheleeee.store'
                    }).json(responseModel_1.ResponseModel.success('OTP verification successful, account verified.', {
                        userData: userDetails,
                        userAccessToken: userAccessToken,
                        userRefreshToken: userRefreshToken
                    }));
                }
                else {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('OTP verification failed! No matching OTP'));
                }
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error', error));
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                yield this.OtpServices.generateAndSendOtp(email);
                return res.status(OK).json(responseModel_1.ResponseModel.success('OTP resent successfully'));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error', error));
            }
        });
    }
}
exports.OtpController = OtpController;
exports.default = OtpController;

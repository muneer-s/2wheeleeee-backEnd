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
exports.generateAndSendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const otpModels_1 = __importDefault(require("../models/otpModels"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
});
const generateAndSendOTP = (toEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = generateRandomOTP();
    const hashedOTP = yield bcrypt_1.default.hash(otp, 10);
    // await OTPModel.create({
    //     email:toEmail,
    //     hashedOTP,
    //     expireAt: new Date(Date.now() + 60 * 1000), 
    //   });
    // Upsert logic: update or create an OTP document for the given email
    yield otpModels_1.default.findOneAndUpdate({ email: toEmail }, {
        $set: {
            hashedOTP,
            expireAt: new Date(Date.now() + 60 * 1000),
        },
    }, { upsert: true, new: true });
    const mailOptions = {
        from: process.env.TRANSPORTER_EMAIL,
        to: toEmail,
        subject: 'OTP Verification',
        text: `Welcome to 2wheleeee. Your OTP for registration is: ${otp}`
    };
    yield transporter.sendMail(mailOptions);
    return otp;
});
exports.generateAndSendOTP = generateAndSendOTP;
function generateRandomOTP() {
    const otpLength = 6;
    const min = Math.pow(10, otpLength - 1);
    const max = Math.pow(10, otpLength) - 1;
    const randomOTP = Math.floor(min + Math.random() * (max - min + 1));
    return randomOTP.toString();
}

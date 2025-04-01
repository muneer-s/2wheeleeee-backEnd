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
const otpGenerator_1 = require("../utils/otpGenerator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const console_1 = require("console");
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
});
class OtpServices {
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    generateAndSendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, otpGenerator_1.generateRandomOTP)();
                const hashedOTP = yield bcrypt_1.default.hash(otp, 10);
                const saveOtp = yield this.otpRepository.saveOtp(email, hashedOTP);
                if (!saveOtp) {
                    console.log("otp is not saved");
                    throw console_1.error;
                }
                const mailOptions = {
                    from: process.env.TRANSPORTER_EMAIL,
                    to: email,
                    subject: 'OTP Verification',
                    text: `Welcome to 2wheleeee. Your OTP for registration is: ${otp}`
                };
                // const a =   await transporter.sendMail(mailOptions)
                const a = yield transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending email:", error);
                    }
                    else {
                        console.log("Email sent:", info.response);
                    }
                });
                console.log("email successfully send : ", a);
                return otp;
            }
            catch (error) {
                console.error("Error generate and send otp service layer:", error);
                throw error;
            }
        });
    }
    verifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let email = data.userId;
                let otp = data.otp;
                return yield this.otpRepository.checkOtp(email, otp);
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
exports.default = OtpServices;

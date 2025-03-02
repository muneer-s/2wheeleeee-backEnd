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
const otpModels_1 = __importDefault(require("../models/otpModels"));
const userModels_1 = __importDefault(require("../models/userModels"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const baseRepository_1 = __importDefault(require("./baseRepository"));
class OtpRepository {
    constructor() {
        this.userRepository = new baseRepository_1.default(userModels_1.default);
        this.otpRepository = new baseRepository_1.default(otpModels_1.default);
    }
    saveOtp(email, hashedOTP) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.otpRepository.findOneAndUpdate({ email }, {
                    $set: {
                        hashedOTP,
                        expireAt: new Date(Date.now() + 60 * 1000),
                    },
                }, { upsert: true, new: true });
                return true;
            }
            catch (error) {
                console.log("Error in otp Repository layer save otp ", error);
                throw error;
            }
        });
    }
    checkOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpRecord = yield this.otpRepository.findOne({ email });
                if (!otpRecord) {
                    console.log(4, 'OTP record not found');
                    return false;
                }
                const isMatch = yield bcrypt_1.default.compare(otp.toString(), otpRecord.hashedOTP);
                if (!isMatch) {
                    console.log(5, 'Invalid OTP');
                    return false;
                }
                yield this.userRepository.updateOne({ email }, { $set: { isVerified: true } });
                return true;
            }
            catch (error) {
                console.log("error showing when check otp is correct ", error);
                throw error;
            }
        });
    }
}
exports.default = OtpRepository;

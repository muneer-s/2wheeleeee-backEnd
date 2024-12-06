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
class UserRepository {
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield userModels_1.default.findOne({ email: email });
                if (userFound) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModels_1.default(userData);
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    checkOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpRecord = yield otpModels_1.default.findOne({ email });
                if (!otpRecord) {
                    console.log('OTP record not found');
                    return false;
                }
                const isMatch = yield bcrypt_1.default.compare(otp.toString(), otpRecord.hashedOTP);
                console.log('fghjkl;', isMatch);
                if (!isMatch) {
                    console.log('Invalid OTP');
                    return false;
                }
                yield userModels_1.default.updateOne({ email }, { $set: { isVerified: true } });
                return true; // OTP is valid
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModels_1.default.findOne({ email: email, isVerified: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getProfile(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModels_1.default.findOne({ email: email });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = UserRepository;

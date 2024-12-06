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
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = httpStatusCodes_1.STATUS_CODES;
class UserServices {
    constructor(userRepository, encrypt, createjwt) {
        this.userRepository = userRepository;
        this.encrypt = encrypt;
        this.createjwt = createjwt;
    }
    userSignup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('new user aano nn checking');
                return yield this.userRepository.emailExistCheck(userData.email);
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
                console.log("servicil", userData);
                return yield this.userRepository.saveUser(userData);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('11111', data);
                let email = data.userId;
                let otp = data.otp;
                return yield this.userRepository.checkOtp(email, otp);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.login(email);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getProfile(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getProfile(email);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = UserServices;

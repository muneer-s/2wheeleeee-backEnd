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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const otpGenerator_1 = require("../utils/otpGenerator");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const userModels_1 = __importDefault(require("../models/userModels"));
const generateToken_1 = require("../utils/generateToken");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = httpStatusCodes_1.STATUS_CODES;
const jwtHandler = new generateToken_1.CreateJWT();
class UserController {
    constructor(UserServices) {
        this.UserServices = UserServices;
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    userSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const userFound = yield this.UserServices.userSignup(userData);
                if (userFound == false) {
                    yield (0, otpGenerator_1.generateAndSendOTP)(req.body.email);
                    const saveData = yield this.UserServices.saveUser(req.body);
                    console.log('saved data: ', saveData);
                    res.status(OK).json({ email: req.body.email, success: true, message: 'OTP sent for verification...' });
                }
                else {
                    console.log('user already nd , so onnum cheyyanda , resposne sended to front end ');
                    res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                const otpMatched = yield this.UserServices.verifyOtp(data);
                if (otpMatched) {
                    const userEmail = data.userId;
                    let userDetails = yield userModels_1.default.findOne({ email: userEmail }, 'email name profile_picture _id');
                    console.log('user details in verify otp , ', userDetails);
                    if (!userDetails) {
                        return res.status(BAD_REQUEST).json({
                            success: false,
                            message: 'User not found!',
                        });
                    }
                    const time = this.milliseconds(23, 30, 0);
                    const userAccessToken = jwtHandler.generateToken(userDetails === null || userDetails === void 0 ? void 0 : userDetails._id.toString());
                    const userRefreshToken = jwtHandler.generateRefreshToken(userDetails === null || userDetails === void 0 ? void 0 : userDetails._id.toString());
                    console.log("user details : ", userDetails);
                    res.status(OK).cookie('user_access_token', userAccessToken, {
                        expires: new Date(Date.now() + time),
                        sameSite: 'strict',
                    }).cookie('user_refresh_token', userRefreshToken, {
                        expires: new Date(Date.now() + time),
                        sameSite: 'strict',
                    }).json({ userData: userDetails, userAccessToken: userAccessToken, userRefreshToken: userRefreshToken, success: true, message: 'OTP verification successful, account verified.' });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: 'OTP verification failed!' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const isUserPresent = yield this.UserServices.login(email);
                console.log('is user present', isUserPresent);
                if (!isUserPresent) {
                    return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' });
                }
                const isPasswordMatch = yield isUserPresent.matchPassword(password);
                if (!isPasswordMatch) {
                    return res.status(400).json({ success: false, message: 'Incorrect password. Please try again.' });
                }
                const time = this.milliseconds(23, 30, 0);
                const userAccessToken = jwtHandler.generateToken(isUserPresent._id.toString());
                const userRefreshToken = jwtHandler.generateRefreshToken(isUserPresent._id.toString());
                return res.status(200).cookie('user_access_token', userAccessToken, {
                    expires: new Date(Date.now() + time),
                    sameSite: 'strict',
                }).json({
                    success: true,
                    message: 'Login successful',
                    user: {
                        email: isUserPresent.email,
                        name: isUserPresent.name,
                        profile_picture: isUserPresent.profile_picture,
                        userId: isUserPresent._id
                    },
                    userAccessToken,
                    userRefreshToken
                });
            }
            catch (error) {
                console.log('Error during login:', error);
                return res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('resend otp req : ', req.body);
                const email = req.body.email;
                console.log(email);
                const otp = yield (0, otpGenerator_1.generateAndSendOTP)(email);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('logout ethi :only cookies clrear cheyyal aanu vendath ', req.body.email);
                res.cookie('user_access_token', '', {
                    httpOnly: true,
                    expires: new Date(0)
                }).cookie('user_refresh_token', '', {
                    httpOnly: true,
                    expires: new Date(0)
                }).status(OK).json({ success: true, message: 'Logged out successfully' });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('get profilil ethiiii');
                const email = (_a = req.query.email) !== null && _a !== void 0 ? _a : ''; // Use a default value if email is undefined
                if (!email || typeof email !== 'string') {
                    return res.status(BAD_REQUEST).json({ success: false, message: 'Invalid email provided' });
                }
                const userDetails = yield this.UserServices.getProfile(email);
                console.log('userd dataaa:    ', userDetails);
                res.status(OK).json({ success: true, userDetails });
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { email } = _a, userData = __rest(_a, ["email"]);
                console.log('User email:', email);
                console.log('User data:', userData);
                if (!email) {
                    return res.status(400).json({ message: "Email is required" });
                }
                const updatedUserData = yield this.UserServices.editProfile(email, userData);
                if (!updatedUserData) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json({
                    message: "User profile updated successfully",
                    data: updatedUserData,
                });
            }
            catch (error) {
                console.error("Controller error updating profile:", error);
                res.status(500).json("Internal server error");
            }
        });
    }
}
exports.UserController = UserController;
exports.default = UserController;

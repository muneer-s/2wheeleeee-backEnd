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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const generateToken_1 = require("../utils/generateToken");
const responseModel_1 = require("../utils/responseModel");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND, FORBIDDEN } = httpStatusCodes_1.STATUS_CODES;
const jwtHandler = new generateToken_1.CreateJWT();
class UserController {
    constructor(UserServices, OtpServices) {
        this.UserServices = UserServices;
        this.OtpServices = OtpServices;
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    userSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                console.log("user data kitti", userData);
                const userFound = yield this.UserServices.userSignup(userData);
                console.log("userne founded : ", userFound);
                if (!userFound) {
                    yield this.OtpServices.generateAndSendOtp(req.body.email);
                    const userWallet = yield this.UserServices.createWallet();
                    userData.wallet = userWallet._id;
                    if (!userWallet) {
                        return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("wallet not created"));
                    }
                    yield this.UserServices.saveUser(userData);
                    return res.status(OK).json(responseModel_1.ResponseModel.success('OTP sent for verification', { email: req.body.email }));
                }
                else {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('The email is already in use!'));
                }
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const isUserPresent = yield this.UserServices.login(email);
                console.log(32, isUserPresent);
                if (!isUserPresent) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error('No account found with this email. Please register first.'));
                }
                const isPasswordMatch = yield isUserPresent.matchPassword(password);
                if (!isPasswordMatch) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('Incorrect password. Please try again.'));
                }
                if (isUserPresent.isBlocked) {
                    return res.status(FORBIDDEN).json(responseModel_1.ResponseModel.error('User is blocked by the admin'));
                }
                // const time = this.milliseconds(0, 1, 0);
                // const refreshTokenExpiryTime = this.milliseconds(0, 3, 0);
                const userAccessToken = jwtHandler.generateToken(isUserPresent._id.toString());
                const userRefreshToken = jwtHandler.generateRefreshToken(isUserPresent._id.toString());
                console.log(11, userAccessToken);
                console.log(22, userRefreshToken);
                return res.status(OK)
                    .cookie('user_access_token', userAccessToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'none', // Allows cross-site cookies
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: '.2wheleeee.store'
                })
                    .cookie('user_refresh_token', userRefreshToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: '.2wheleeee.store'
                })
                    .json(responseModel_1.ResponseModel.success('Login successfull', {
                    user: {
                        email: isUserPresent.email,
                        name: isUserPresent.name,
                        profile_picture: isUserPresent.profile_picture,
                        userId: isUserPresent._id
                    },
                    userAccessToken,
                    userRefreshToken
                }));
            }
            catch (error) {
                console.log('Error during login:', error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('An unexpected error occurred. Please try again later.', error));
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res
                    .clearCookie('user_access_token', {
                    httpOnly: true, // cookie can't be accessed via JavaScript (prevents XSS attacks).
                    secure: process.env.NODE_ENV === 'production', // cookie is sent only over HTTPS (ensure your environment supports HTTPS).
                    sameSite: 'none', // prevents cross-site requests (adds CSRF protection)
                    domain: '.2wheleeee.store',
                })
                    .clearCookie('user_refresh_token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    domain: '.2wheleeee.store',
                })
                    .status(OK)
                    .json(responseModel_1.ResponseModel.success('Logged out successfully'));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    return res.status(NOT_FOUND).json({ success: false, message: "Email is required." });
                }
                //const forgotPassword: any = await this._userUsecase.forgotPassword(req.body.email);
                // if (forgotPassword.status == 400) {
                //     return res.status(forgotPassword.status).json(forgotPassword.message);
                // }
                // return res.status(forgotPassword.status).json(forgotPassword.message);
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = (_a = req.query.email) !== null && _a !== void 0 ? _a : '';
                if (!email || typeof email !== 'string') {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('Invalid email provided'));
                }
                const userDetails = yield this.UserServices.getProfile(email);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Success', userDetails));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { email } = _a, userData = __rest(_a, ["email"]);
                if (!email) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("Email is required"));
                }
                const updatedUserData = yield this.UserServices.editProfile(email, userData, req);
                if (!updatedUserData) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("User not found"));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success("User profile updated successfully", {
                    data: updatedUserData,
                    user: {
                        email: updatedUserData.email,
                        name: updatedUserData.name,
                        profile_picture: updatedUserData.profile_picture,
                        userId: updatedUserData._id
                    },
                }));
            }
            catch (error) {
                console.error("Controller error updating profile:", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    editUserDocuments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUserDocuments = yield this.UserServices.editUserDocuments(req, res);
                return res.status(OK).json(responseModel_1.ResponseModel.success('User profile updated successfully', { data: updatedUserDocuments }));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    GetBikeList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = '', fuelType, minRent, maxRent } = req.query;
                const result = yield this.UserServices.GetBikeList({
                    page: Number(page),
                    limit: Number(limit),
                    search: String(search),
                    fuelType: String(fuelType),
                    minRent: Number(minRent),
                    maxRent: Number(maxRent),
                });
                return res.status(OK).json(responseModel_1.ResponseModel.success('Get Bike List', {
                    bikeList: result.bikeList,
                    totalBikes: result.totalBikes,
                    totalPages: result.totalPages,
                }));
            }
            catch (error) {
                console.error('Error in controller GetBikeList:', error);
                res.status(500).json({ success: false, message: 'Failed to get bike list' });
            }
        });
    }
    getBikeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const bike = yield this.UserServices.getBikeDetails(id);
                if (!bike)
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error('Bike not found'));
                return res.status(OK).json(responseModel_1.ResponseModel.success('Bike Details', bike));
            }
            catch (error) {
                console.error("Error getting bike details :", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("Failed to get bike Deatils", error));
            }
        });
    }
    checkBlockedStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.UserServices.findUserByEmail(email);
                if (!user) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error('User not found'));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success('success', { isBlocked: user.isBlocked }));
            }
            catch (error) {
                console.error('Error checking user status:', error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error', error));
            }
        });
    }
    getOrderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                if (!userId) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("User ID is required"));
                }
                const orders = yield this.UserServices.getOrder(userId.toString());
                if (orders.length === 0) {
                    console.log("no order get for the user ");
                    return res.status(OK).json(responseModel_1.ResponseModel.success('No orders found for this user', { orders: [] }));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success('Order List Getting Success', { order: orders || [] }));
            }
            catch (error) {
                console.log("error in user controller getting order list : ", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    getOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderDetails = yield this.UserServices.orderDetails(req.params.orderId);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Order Details Get", orderDetails));
            }
            catch (error) {
                console.log("error in admin controller getting order details : ", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    earlyReturn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const updatedOrder = yield this.UserServices.findOrderAndUpdate(orderId);
                if (!updatedOrder) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("Order not found"));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success("Order status updated successfully", updatedOrder));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    returnOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const updatedOrder = yield this.UserServices.returnOrder(orderId);
                if (!updatedOrder) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("Order not found"));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success("Order status updated successfully", updatedOrder));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    submitReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewerId, bikeId, rating, feedback } = req.body;
                if (!reviewerId || !bikeId || !rating) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("All fields are required."));
                }
                const allreadyReviewed = yield this.UserServices.userAlreadyReviewed(reviewerId);
                if (allreadyReviewed) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error('User Already submitted a Review'));
                }
                const review = yield this.UserServices.submitReview(reviewerId, bikeId, rating, feedback);
                if (!review) {
                    return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("Failed to submit review."));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success("Review submitted successfully!", review));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bikeId } = req.params;
                if (!bikeId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Bike ID is required"));
                }
                const reviews = yield this.UserServices.findReviews(bikeId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Get reviews of the bike', { data: reviews }));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    isBikeAlreadyBooked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bikeId = req.params.bikeId;
                console.log(12121, bikeId);
                let bikeOrdered = false;
                const allOrders = yield this.UserServices.allOrders();
                console.log(2222, allOrders);
                bikeOrdered = allOrders === null || allOrders === void 0 ? void 0 : allOrders.some(order => order.bikeId.toString() === bikeId && order.status !== "Completed");
                console.log("Bike Ordered:", bikeOrdered);
                return res.status(OK).json(responseModel_1.ResponseModel.success("This bike order status : ", { bikeOrdered: bikeOrdered }));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
}
exports.UserController = UserController;
exports.default = UserController;

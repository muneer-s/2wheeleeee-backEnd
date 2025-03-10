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
exports.AdminController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const dotenv_1 = __importDefault(require("dotenv"));
const generateToken_1 = require("../utils/generateToken");
const responseModel_1 = require("../utils/responseModel");
dotenv_1.default.config();
const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } = httpStatusCodes_1.STATUS_CODES;
const jwtHandler = new generateToken_1.CreateJWT();
class AdminController {
    constructor(AdminServices) {
        this.AdminServices = AdminServices;
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(UNAUTHORIZED).json(responseModel_1.ResponseModel.error('Email and password are required'));
                }
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;
                if (email !== adminEmail || password !== adminPassword) {
                    return res.status(UNAUTHORIZED).json(responseModel_1.ResponseModel.error('Invalid email or password'));
                }
                // const time = this.milliseconds(0, 30, 0);
                // const refreshTokenExpires = 48 * 60 * 60 * 1000;
                const token = jwtHandler.generateToken(adminEmail);
                const refreshToken = jwtHandler.generateRefreshToken(adminEmail);
                return res.status(OK)
                    .cookie('admin_access_token', token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: '.2wheleeee.store'
                })
                    .cookie('admin_refresh_token', refreshToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: '.2wheleeee.store'
                })
                    .json(responseModel_1.ResponseModel.success('Login successful', {
                    adminEmail: adminEmail,
                    token,
                    refreshToken
                }));
            }
            catch (error) {
                console.error('Admin login error:', error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error'));
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('admin_access_token', {
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: '.2wheleeee.store'
                });
                res.clearCookie('admin_refresh_token', {
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: '.2wheleeee.store'
                });
                return res.status(OK).json({ success: true, message: 'Logged out successfully' });
            }
            catch (error) {
                console.error('Admin logout error:', error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = '', isBlocked, isUser } = req.query;
                const findUsers = yield this.AdminServices.getAllUsers({
                    page: Number(page),
                    limit: Number(limit),
                    search: String(search),
                    isBlocked: isBlocked ? String(isBlocked) : undefined,
                    isUser: isUser ? String(isUser) : undefined
                });
                return res.status(OK).json(responseModel_1.ResponseModel.success('All Users List', {
                    usersList: findUsers === null || findUsers === void 0 ? void 0 : findUsers.users,
                    totalUsers: findUsers === null || findUsers === void 0 ? void 0 : findUsers.totalUsers,
                    totalPages: findUsers === null || findUsers === void 0 ? void 0 : findUsers.totalPages,
                }));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal Server Error', error));
            }
        });
    }
    getSingleUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield this.AdminServices.getSingleUser(userId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Singel User Details', user));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    userVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield this.AdminServices.userVerify(userId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Success', user));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    userBlockUnBlock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield this.AdminServices.userBlockUnblock(userId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Success', user));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("INTERNAL SERVER ERROR", error));
            }
        });
    }
    getAllBikeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = '', filter = '', sort = '' } = req.query;
                const query = Object.assign({}, (filter && { isHost: filter === 'verified' }));
                const options = {
                    skip: (Number(page) - 1) * Number(limit),
                    limit: Number(limit),
                    sort: sort === 'asc' ? { rentAmount: 1 } : sort === 'desc' ? { rentAmount: -1 } : {},
                    search
                };
                let bikeDetails = yield this.AdminServices.getAllBikeDetails(query, options);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Bike details Get successfully', bikeDetails));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    verifyHost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bikeId = req.params.id;
                const { reason } = req.body;
                if (reason) {
                    const bike = yield this.AdminServices.revokeHost(bikeId, reason);
                    return res.status(OK).json(responseModel_1.ResponseModel.success('Revoked', bike));
                }
                else {
                    const bike = yield this.AdminServices.verifyHost(bikeId);
                    return res.status(OK).json(responseModel_1.ResponseModel.success('Verified', bike));
                }
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    isEditOn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bikeId = req.params.id;
                const bike = yield this.AdminServices.isEditOn(bikeId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Success', bike));
            }
            catch (error) {
                console.log("error is from is edit on ", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    getOrderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.AdminServices.getOrder();
                return res.status(OK).json(responseModel_1.ResponseModel.success('Order List Getting Success', { order: orders }));
            }
            catch (error) {
                console.log("error in admin controller getting order list : ", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    getOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Request received for Order Details", req.params.orderId);
                const orderDetails = yield this.AdminServices.orderDetails(req.params.orderId);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Order Details Get", orderDetails));
            }
            catch (error) {
                console.log("error in admin controller getting order details : ", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    getAllFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allFeedbacks = yield this.AdminServices.allFeedbacks();
                return res.status(OK).json(responseModel_1.ResponseModel.success('Get all feedbacks', allFeedbacks));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error'));
            }
        });
    }
    deleteFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedbackId = req.params.feedbackId;
                if (!feedbackId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("feedback id is missing"));
                }
                const deletedFeedback = yield this.AdminServices.deleteFeedback(feedbackId);
                if (!deletedFeedback) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("No Feedback Found"));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success("Feedback deleted"));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error'));
            }
        });
    }
}
exports.AdminController = AdminController;
exports.default = AdminController;

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
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = httpStatusCodes_1.STATUS_CODES;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const responseModel_1 = require("../utils/responseModel");
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
});
const uploadToCloudinary = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinaryConfig_1.default.uploader.upload_stream({
            folder,
            transformation: [
                { width: 500, height: 500, crop: "limit" }
            ]
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
            }
            else {
                resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
            }
        });
        if (file === null || file === void 0 ? void 0 : file.path) {
            const fs = require("fs");
            const stream = fs.createReadStream(file.path);
            stream.pipe(uploadStream);
        }
        else {
            reject(new Error("File path is undefined"));
        }
    });
});
class UserServices {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    userSignup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.emailExistCheck(userData.email);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.createWallet();
            }
            catch (error) {
                throw error;
            }
        });
    }
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.saveUser(userData);
            }
            catch (error) {
                console.log(error);
                throw error;
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
                throw error;
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
                throw error;
            }
        });
    }
    editProfile(email, userData, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cloudinaryUrl = null;
                if (req.file && req.file.buffer) {
                    const result = yield new Promise((resolve, reject) => {
                        var _a;
                        const uploadStream = cloudinaryConfig_1.default.uploader.upload_stream({
                            folder: "profile_pictures",
                            transformation: [
                                { width: 500, height: 500, crop: "limit" }
                            ]
                        }, (error, result) => {
                            if (error) {
                                console.error("Cloudinary upload error:", error);
                                reject(error);
                            }
                            else {
                                resolve(result);
                            }
                        });
                        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
                            uploadStream.end(req.file.buffer);
                        }
                        else {
                            reject(new Error("File buffer is undefined"));
                        }
                    });
                    cloudinaryUrl = result === null || result === void 0 ? void 0 : result.secure_url;
                    userData.profile_picture = cloudinaryUrl;
                }
                const updatedUser = yield this.userRepository.editProfile(email, userData);
                if (!updatedUser) {
                    throw new Error("User not found");
                }
                return updatedUser;
            }
            catch (error) {
                console.error("Service error updating profile:", error);
                throw new Error("Service error updating user profile");
            }
        });
    }
    editUserDocuments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const frontImage = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.frontImage) === null || _b === void 0 ? void 0 : _b[0];
                const backImage = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c.backImage) === null || _d === void 0 ? void 0 : _d[0];
                const userId = req.body.userId;
                const licenseNumber = req.body.license_number;
                const licenseExpDate = req.body.license_Exp_Date;
                const existingUser = yield this.userRepository.getUserById(userId);
                if (!existingUser) {
                    return res.status(httpStatusCodes_1.STATUS_CODES.NOT_FOUND).json(responseModel_1.ResponseModel.error("User not found"));
                }
                let frontImageUrl = existingUser.license_picture_front;
                let backImageUrl = existingUser.license_picture_back;
                if (frontImage) {
                    frontImageUrl = yield uploadToCloudinary(frontImage, "user_documents");
                }
                if (backImage) {
                    backImageUrl = yield uploadToCloudinary(backImage, "user_documents");
                }
                const documentData = {
                    license_number: licenseNumber,
                    license_Exp_Date: licenseExpDate,
                    license_picture_front: frontImageUrl,
                    license_picture_back: backImageUrl,
                };
                const result = yield this.userRepository.saveUserDocuments(userId, documentData);
                return result;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    GetBikeList(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, search, fuelType, minRent, maxRent } = filters;
                const query = { isHost: true };
                if (search) {
                    query.$or = [
                        { modelName: { $regex: search, $options: 'i' } },
                        { companyName: { $regex: search, $options: 'i' } },
                        { location: { $regex: search, $options: 'i' } },
                    ];
                }
                if (fuelType) {
                    query.fuelType = fuelType;
                }
                if (minRent && maxRent) {
                    query.rentAmount = { $gte: minRent, $lte: maxRent };
                }
                const skip = (page - 1) * limit;
                const bikeList = yield this.userRepository.getBikeList(query, skip, limit);
                const totalBikes = yield this.userRepository.countBikes(query);
                return {
                    bikeList,
                    totalBikes,
                    totalPages: Math.ceil(totalBikes / limit),
                };
            }
            catch (error) {
                console.error("Error in getbikelist service layer:", error);
                throw error;
            }
        });
    }
    getBikeDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.getBikeDetails(id);
                return result;
            }
            catch (error) {
                console.error("Error in getbikedetails service layer:", error);
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findUserByEmail(email);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getOrder(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getOrder(userId);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    orderDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.userRepository.findOrder(orderId);
                if (!order) {
                    throw new Error("Order not found");
                }
                const bike = yield this.userRepository.findBike(order === null || order === void 0 ? void 0 : order.bikeId.toString());
                if (!bike) {
                    throw new Error("Bike details not found");
                }
                const owner = yield this.userRepository.findUser(bike.userId.toString());
                if (!owner) {
                    throw new Error("Bike owner details not found");
                }
                return {
                    order,
                    bike,
                    owner,
                };
            }
            catch (error) {
                console.error("Error in AdminServices.orderDetails:", error);
                throw error;
            }
        });
    }
    findOrderAndUpdate(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findOrderAndUpdate(orderId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    returnOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.returnOrder(orderId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    submitReview(reviewerId, bikeId, rating, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.submitReview(reviewerId, bikeId, rating, feedback);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findReviews(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findReviews(bikeId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    userAlreadyReviewed(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.userAlreadyReviewed(userid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    allOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.allOrders();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserServices;

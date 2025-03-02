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
const mongoose_1 = __importDefault(require("mongoose"));
const bikeModel_1 = __importDefault(require("../models/bikeModel"));
const userModels_1 = __importDefault(require("../models/userModels"));
const baseRepository_1 = __importDefault(require("./baseRepository"));
const walletModel_1 = __importDefault(require("../models/walletModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const console_1 = require("console");
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
class UserRepository {
    constructor() {
        this.userRepository = new baseRepository_1.default(userModels_1.default);
        this.bikeRepository = new baseRepository_1.default(bikeModel_1.default);
        this.walletRepository = new baseRepository_1.default(walletModel_1.default);
        this.orderRepository = new baseRepository_1.default(orderModel_1.default);
        this.reviewRepository = new baseRepository_1.default(reviewModel_1.default);
    }
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.userRepository.findOne({ email: email });
                if (userFound) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.userRepository.create(userData);
                return newUser;
            }
            catch (error) {
                console.log('Error in Save user: ', error);
                throw error;
            }
        });
    }
    createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield this.walletRepository.create({ balance: 0 });
                return wallet;
            }
            catch (error) {
                console.error("error in creating wallet: ", error);
                throw error;
            }
        });
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findOne({ email: email, isVerified: true });
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
                return yield this.userRepository.findOne({ email: email });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    editProfile(email, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.userRepository.findOneAndUpdate({ email }, { $set: userData }, { new: true, runValidators: true });
                return updatedUser;
            }
            catch (error) {
                console.error("Error updating profile:", error);
                throw error;
            }
        });
    }
    saveUserDocuments(userId, documentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.userRepository.updateById(userId, {
                    license_number: documentData.license_number,
                    license_Exp_Date: documentData.license_Exp_Date,
                    license_picture_front: documentData.license_picture_front,
                    license_picture_back: documentData.license_picture_back,
                });
                return updatedUser;
            }
            catch (error) {
                console.error("Error updating user documents in the repository:", error);
                throw error;
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findById(userId);
            }
            catch (error) {
                console.log('Error in getUserById: ', error);
                throw error;
            }
        });
    }
    getBikeList(query, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.bikeRepository.getList(query, skip, limit);
            }
            catch (error) {
                console.error('Error in repository getBikeList:', error);
                throw error;
            }
        });
    }
    countBikes(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.bikeRepository.countDocuments(query);
            }
            catch (error) {
                console.error('Error in repository countBikes:', error);
                throw error;
            }
        });
    }
    getBikeDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = [
                    {
                        $match: { _id: new mongoose_1.default.Types.ObjectId(id) },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userDetails",
                        },
                    },
                    {
                        $unwind: "$userDetails",
                    },
                ];
                const bikeDetails = yield this.bikeRepository.aggregate(pipeline);
                if (!bikeDetails || bikeDetails.length === 0) {
                    console.log("Bike not found");
                    return null;
                }
                return bikeDetails[0];
            }
            catch (error) {
                console.error("Error fetching bike and user details:", error);
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findOne({ email });
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
                const orders = yield this.orderRepository.find({ userId }, { sort: { createdAt: -1 } });
                if (!orders || orders.length === 0) {
                    return [];
                }
                return orders;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    findOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderdetails = yield this.orderRepository.findById(orderId);
                if (!orderdetails) {
                    throw console_1.error;
                }
                return orderdetails;
            }
            catch (error) {
                console.log("error in admin repository is find order : ", error);
                throw error;
            }
        });
    }
    findBike(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bikeDetails = yield this.bikeRepository.findById(bikeId);
                if (!bikeDetails) {
                    throw console_1.error;
                }
                return bikeDetails;
            }
            catch (error) {
                console.log("error in admin repository is find bike : ", error);
                throw error;
            }
        });
    }
    findUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield this.userRepository.findById(userId);
                if (!userDetails) {
                    throw console_1.error;
                }
                return userDetails;
            }
            catch (error) {
                console.log("error in admin repository is find owner : ", error);
                throw error;
            }
        });
    }
    findOrderAndUpdate(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.orderRepository.findOneAndUpdate({ _id: orderId }, { status: "Early Return" }, { new: true });
                if (!result) {
                    throw new Error("Error while return early");
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    returnOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.orderRepository.findOneAndUpdate({ _id: orderId }, { status: "Return" }, { new: true });
                if (!result) {
                    throw new Error("Error while return");
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    submitReview(reviewerId, bikeId, rating, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReview = {
                    reviewerId: new mongoose_1.default.Types.ObjectId(reviewerId),
                    bikeId: new mongoose_1.default.Types.ObjectId(bikeId),
                    rating,
                    feedback,
                };
                return yield this.reviewRepository.create(newReview);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findReviews(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reviewRepository.findAndSort({ bikeId }, { createdAt: -1 });
            }
            catch (error) {
                throw error;
            }
        });
    }
    userAlreadyReviewed(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reviewRepository.findOne({ reviewerId: userid });
            }
            catch (error) {
                throw error;
            }
        });
    }
    allOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.findAll();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserRepository;

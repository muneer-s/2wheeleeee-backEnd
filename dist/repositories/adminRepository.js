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
const bikeModel_1 = __importDefault(require("../models/bikeModel"));
const userModels_1 = __importDefault(require("../models/userModels"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const baseRepository_1 = __importDefault(require("./baseRepository"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const console_1 = require("console");
const feedback_1 = __importDefault(require("../models/feedback"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
});
class AdminRepository {
    constructor() {
        this.userRepository = new baseRepository_1.default(userModels_1.default);
        this.bikeRepository = new baseRepository_1.default(bikeModel_1.default);
        this.orderRepository = new baseRepository_1.default(orderModel_1.default);
        this.feedbackRepository = new baseRepository_1.default(feedback_1.default);
    }
    getAllUsers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, search, isBlocked, isUser } = filters;
                const query = {};
                if (isBlocked !== undefined)
                    query.isBlocked = isBlocked;
                if (isUser !== undefined)
                    query.isUser = isUser;
                if (search)
                    query.name = { $regex: search, $options: 'i' };
                const skip = (page - 1) * limit;
                const sort = { name: 1 };
                const users = yield this.userRepository.find(query, { sort, skip, limit });
                const totalUsers = yield this.userRepository.count(query);
                const totalPages = Math.ceil(totalUsers / limit);
                return { users, totalUsers, totalPages };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSingleUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findById(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    userVerify(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user)
                    return 'User not found';
                user.isUser = !user.isUser;
                yield user.save();
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    userBlockUnblock(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.userRepository.findById(userId);
                if (!findUser) {
                    return { success: false, message: "User not found" };
                }
                findUser.isBlocked = !findUser.isBlocked;
                if (findUser.isBlocked) {
                    const mailOptions = {
                        from: process.env.TRANSPORTER_EMAIL,
                        to: findUser === null || findUser === void 0 ? void 0 : findUser.email,
                        subject: 'Account Blocked by Admin',
                        text: `Your account has been blocked by the admin due to certain activities. Please contact support if you believe this is a mistake.`,
                    };
                    try {
                        yield transporter.sendMail(mailOptions);
                    }
                    catch (emailError) {
                        console.error('Error sending email:', emailError);
                        return { success: false, message: 'Failed to send email notification' };
                    }
                }
                yield findUser.save();
                return findUser;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllBikeDetails(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, limit, sort, search } = options;
                const pipeline = [
                    { $match: query },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userDetails",
                        },
                    },
                    { $unwind: "$userDetails" },
                ];
                if (search) {
                    pipeline.push({
                        $match: {
                            "userDetails.name": { $regex: search, $options: "i" }, // Case-insensitive search
                        },
                    });
                }
                if (Object.keys(sort).length > 0) {
                    pipeline.push({ $sort: sort });
                }
                else {
                    pipeline.push({ $sort: { _id: 1 } });
                }
                pipeline.push({ $skip: skip }, { $limit: limit }, {
                    $project: {
                        _id: 1,
                        companyName: 1,
                        modelName: 1,
                        rentAmount: 1,
                        fuelType: 1,
                        images: 1,
                        isBlocked: 1,
                        isHost: 1,
                        registerNumber: 1,
                        insuranceExpDate: 1,
                        polutionExpDate: 1,
                        rcImage: 1,
                        insuranceImage: 1,
                        PolutionImage: 1,
                        "userDetails._id": 1,
                        "userDetails.name": 1,
                        "userDetails.email": 1,
                        "userDetails.phoneNumber": 1,
                        "userDetails.address": 1,
                        "userDetails.profile_picture": 1,
                    },
                });
                // const result = await bikeModel.aggregate(pipeline);
                const bikesWithUserDetails = yield this.bikeRepository.aggregate(pipeline);
                // const total = await bikeModel.countDocuments(query);
                const total = yield this.bikeRepository.count(query);
                const result = bikesWithUserDetails.map((bike) => {
                    return Object.assign(Object.assign({}, bike), { userDetails: bike.userDetails });
                });
                console.log(222222222, result);
                return { bikes: result, total };
            }
            catch (error) {
                console.error("Error fetching bike details with user details:", error);
                throw error;
            }
        });
    }
    verifyHost(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bike = yield this.bikeRepository.findById(bikeId);
                if (!bike)
                    return 'User not found';
                bike.isHost = true;
                const user = yield this.userRepository.findById(bike.userId.toString());
                if (bike.isHost) {
                    const mailOptions = {
                        from: process.env.TRANSPORTER_EMAIL,
                        to: user === null || user === void 0 ? void 0 : user.email,
                        subject: 'Approved Mail',
                        text: `Welcome to 2wheleeee. Your Host Service is approved`
                    };
                    yield transporter.sendMail(mailOptions);
                }
                yield bike.save();
                return bike;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    revokeHost(bikeId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bike = yield this.bikeRepository.findById(bikeId);
                if (!bike)
                    return 'User not found';
                bike.isHost = false;
                const user = yield this.userRepository.findById(bike.userId.toString());
                if (!bike.isHost) {
                    const mailOptions = {
                        from: process.env.TRANSPORTER_EMAIL,
                        to: user === null || user === void 0 ? void 0 : user.email,
                        subject: 'Revoke Mail',
                        text: `Welcome to 2wheleeee. Your Host Service is Rejected \n Reason : ${reason}`
                    };
                    yield transporter.sendMail(mailOptions);
                    console.log("mailllllllllllllllll aayxhuuuuuuuuuuuuuuuuuutooooooooooooooooooooooooooo");
                }
                yield bike.save();
                return bike;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findOne({ email });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isEditOn(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bike = yield this.bikeRepository.findById(bikeId);
                if (!bike) {
                    throw new Error("Bike not found");
                }
                bike.isEdit = true;
                bike.isHost = false;
                yield bike.save();
                return bike;
            }
            catch (error) {
                console.log("error is repository is edit on : ", error);
                throw error;
            }
        });
    }
    getOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.orderRepository.findModel();
                return order;
            }
            catch (error) {
                console.log("error in admin repository is get order : ", error);
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
                console.log("error in admin repository is find user : ", error);
                throw error;
            }
        });
    }
    allFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.findFeedback();
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteFeedback(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.feedbackRepository.findByIdAndDelete(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminRepository;

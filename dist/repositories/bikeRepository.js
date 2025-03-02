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
const baseRepository_1 = __importDefault(require("./baseRepository"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const console_1 = require("console");
class HostRepository {
    constructor() {
        this.userRepository = new baseRepository_1.default(userModels_1.default);
        this.bikeRepository = new baseRepository_1.default(bikeModel_1.default);
        this.orderRepository = new baseRepository_1.default(orderModel_1.default);
    }
    saveBikeDetails(documentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.bikeRepository.create(documentData);
            }
            catch (error) {
                console.error("Error updating user documents in the repository:", error);
                throw new Error("Failed to update user documents in the database");
            }
        });
    }
    isAdminVerifyUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                return user;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to verify user');
            }
        });
    }
    fetchBikeData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId)
                    throw new Error("User ID is undefined");
                const bikes = yield this.bikeRepository.find({ userId });
                return bikes;
            }
            catch (error) {
                console.error("Error in repository layer:", error);
                throw error;
            }
        });
    }
    bikeSingleView(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!bikeId)
                    throw new Error("User ID is undefined");
                const bike = yield this.bikeRepository.findById(bikeId);
                return bike;
            }
            catch (error) {
                console.error('Error fetching single bike view in the repository:', error);
                throw error;
            }
        });
    }
    deleteBike(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!bikeId)
                    throw new Error('Bike ID is undefined');
                const result = yield this.bikeRepository.deleteOne({ _id: bikeId });
                if (result.deletedCount === 0) {
                    throw new Error('Bike not found');
                }
                return true;
            }
            catch (error) {
                console.error('Error deleting bike in the repository:', error);
                throw error;
            }
        });
    }
    editBike(insuranceExpDate, polutionExpDate, insuranceImageUrl, PolutionImageUrl, bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
                    insuranceExpDate,
                    polutionExpDate,
                    insuranceImage: insuranceImageUrl || undefined,
                    PolutionImage: PolutionImageUrl || undefined,
                    isEdit: false,
                    isHost: false
                };
                const updatedBike = yield this.bikeRepository.updateById(bikeId, updateData);
                if (!updatedBike) {
                    throw new Error("Bike not found.");
                }
                return updatedBike;
            }
            catch (error) {
                console.error("Error in repository layer edit bike:", error);
                throw error;
            }
        });
    }
    getOrder(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderRepository.find({ ownerId: userId });
                console.log(3333333333333333333333333333333333333333333333, orders);
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
                const order = yield this.orderRepository.findById(orderId);
                if (!order) {
                    throw console_1.error;
                }
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user)
                    throw console_1.error;
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = HostRepository;

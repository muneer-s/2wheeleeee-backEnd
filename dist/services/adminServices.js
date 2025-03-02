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
class AdminServices {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    getAllUsers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.getAllUsers(filters);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getSingleUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.getSingleUser(userId);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    userVerify(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.userVerify(userId);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    userBlockUnblock(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.userBlockUnblock(userId);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllBikeDetails(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.getAllBikeDetails(query, options);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    verifyHost(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.verifyHost(bikeId);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    revokeHost(bikeId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.revokeHost(bikeId, reason);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.findUserByEmail(email);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    isEditOn(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.isEditOn(bikeId);
            }
            catch (error) {
                console.log("error is is edit on : ", error);
                throw error;
            }
        });
    }
    getOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminRepository.getOrder();
                return result;
            }
            catch (error) {
                console.log("error in admin services get order list :  ", error);
                throw error;
            }
        });
    }
    orderDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.adminRepository.findOrder(orderId);
                if (!order) {
                    throw new Error("Order not found");
                }
                const bike = yield this.adminRepository.findBike(order === null || order === void 0 ? void 0 : order.bikeId.toString());
                if (!bike) {
                    throw new Error("Bike details not found");
                }
                const owner = yield this.adminRepository.findUser(bike.userId.toString());
                if (!owner) {
                    throw new Error("Bike owner details not found");
                }
                const user = yield this.adminRepository.findUser(order.userId.toString());
                if (!user) {
                    throw new Error("User details not found");
                }
                return {
                    order,
                    bike,
                    owner,
                    user
                };
            }
            catch (error) {
                console.error("Error in AdminServices.orderDetails:", error);
                throw error;
            }
        });
    }
    allFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.allFeedbacks();
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteFeedback(feedbackId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.deleteFeedback(feedbackId);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminServices;

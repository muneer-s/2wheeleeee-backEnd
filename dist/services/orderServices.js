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
class orderServices {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    saveOrder(newOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.orderRepository.saveOrder(newOrder);
                return result;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    findBike(bikeId) {
        try {
            const result = this.orderRepository.findBike(bikeId);
            return result;
        }
        catch (error) {
            console.log("Error in order service findownerof bike", error);
            throw error;
        }
    }
    findOrder(orderId) {
        try {
            const result = this.orderRepository.findOrder(orderId);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    addBalance(walletId, refundAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.addBalance(walletId, refundAmount);
            }
            catch (error) {
                throw error;
            }
        });
    }
    completeOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.completeOrder(orderId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.findUser(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = orderServices;

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
class walletServices {
    constructor(walletRepository) {
        this.walletRepository = walletRepository;
    }
    getWallet(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.walletRepository.getWallet(walletId);
                return result;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    saveWallet(walletId, newBalance, total, bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const historyEntry = {
                    date: new Date(),
                    type: "debit",
                    amount: total,
                    reason: bikeId
                };
                return yield this.walletRepository.updateWalletBalance(walletId, newBalance, historyEntry);
            }
            catch (error) {
                console.error("Error in WalletServices - saveWallet:", error);
                throw error;
            }
        });
    }
}
exports.default = walletServices;

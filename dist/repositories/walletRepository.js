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
const baseRepository_1 = __importDefault(require("./baseRepository"));
const walletModel_1 = __importDefault(require("../models/walletModel"));
class walletRepository {
    constructor() {
        this.walletRepository = new baseRepository_1.default(walletModel_1.default);
    }
    getWallet(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.walletRepository.findById(walletId);
                if (!result) {
                    throw new Error("Wallet not found");
                }
                result.history = result.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                return result;
            }
            catch (error) {
                console.log("error in repository layer of get wallet", error);
                throw error;
            }
        });
    }
    updateWalletBalance(walletId, newBalance, historyEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedWallet = yield this.walletRepository.updateById(walletId, {
                    $set: { balance: newBalance },
                    $push: { history: historyEntry },
                });
                if (!updatedWallet) {
                    throw new Error("Wallet not found or update failed");
                }
                return updatedWallet;
            }
            catch (error) {
                console.error("Error in walletRepository - updateWalletBalance:", error);
                throw error;
            }
        });
    }
}
exports.default = walletRepository;

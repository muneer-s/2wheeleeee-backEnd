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
exports.WalletController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const responseModel_1 = require("../utils/responseModel");
const { OK, NOT_FOUND } = httpStatusCodes_1.STATUS_CODES;
class WalletController {
    constructor(WalletServices) {
        this.WalletServices = WalletServices;
    }
    getWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { walletId } = req.params;
                if (!walletId) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("wallet id missing"));
                }
                const wallet = yield this.WalletServices.getWallet(walletId);
                if (!wallet) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("Wallet not found"));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success('Get wallet', wallet));
            }
            catch (error) {
                console.error("Error fetching wallet:", error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
}
exports.WalletController = WalletController;
exports.default = WalletController;

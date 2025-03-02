"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletRepository_1 = __importDefault(require("../repositories/walletRepository"));
const walletServices_1 = __importDefault(require("../services/walletServices"));
const walletController_1 = __importDefault(require("../controllers/walletController"));
const walletrepository = new walletRepository_1.default();
const walletservice = new walletServices_1.default(walletrepository);
const walletController = new walletController_1.default(walletservice);
const walletRouter = express_1.default.Router();
walletRouter
    .get('/getWallet/:walletId', (req, res) => { walletController.getWallet(req, res); });
exports.default = walletRouter;

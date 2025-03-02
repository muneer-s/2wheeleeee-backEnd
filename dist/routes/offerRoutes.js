"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const offerRepository_1 = __importDefault(require("../repositories/offerRepository"));
const offerServices_1 = __importDefault(require("../services/offerServices"));
const offerController_1 = __importDefault(require("../controllers/offerController"));
const userAuthMiddleware_1 = __importDefault(require("../middleware/userAuthMiddleware"));
const offerRep = new offerRepository_1.default();
const offerSer = new offerServices_1.default(offerRep);
const offerController = new offerController_1.default(offerSer);
const offerRouter = express_1.default.Router();
offerRouter
    .post('/Offer', userAuthMiddleware_1.default, (req, res) => { offerController.createOffer(req, res); })
    .get('/Offer', userAuthMiddleware_1.default, (req, res) => { offerController.viewOffers(req, res); })
    .delete('/deleteOffer/:id', userAuthMiddleware_1.default, (req, res) => { offerController.deleteOffer(req, res); })
    .put('/updateOffer/:id', userAuthMiddleware_1.default, (req, res) => { offerController.updateOffer(req, res); })
    .put('/applyOffer', userAuthMiddleware_1.default, (req, res) => { offerController.applyOffer(req, res); })
    .put('/removeOffer', userAuthMiddleware_1.default, (req, res) => { offerController.removeOffer(req, res); });
exports.default = offerRouter;

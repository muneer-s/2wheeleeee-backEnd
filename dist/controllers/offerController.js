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
exports.OfferController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const responseModel_1 = require("../utils/responseModel");
const offerModel_1 = __importDefault(require("../models/offerModel"));
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatusCodes_1.STATUS_CODES;
class OfferController {
    constructor(offerServices) {
        this.offerServices = offerServices;
    }
    createOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { offerName, discount, startDate, endDate, description, createdBy } = req.body;
                if (!offerName || !discount || !startDate || !endDate) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("All fields except description are required."));
                }
                if (discount <= 0) {
                    return res.status(BAD_REQUEST).json({ message: "Discount must be greater than 0." });
                }
                const today = new Date().toISOString().split("T")[0];
                if (startDate < today) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Start date must be greater than today."));
                }
                if (endDate <= startDate) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("End date must be after the start date."));
                }
                const newOffer = new offerModel_1.default({ offerName, discount, startDate, endDate, description, offerBy: createdBy });
                yield this.offerServices.saveOffer(newOffer);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Offer created successfully"));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error', error));
            }
        });
    }
    viewOffers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("User ID is required."));
                }
                const result = yield this.offerServices.viewOffer(userId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Get the offer list', { offer: result }));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error', error));
            }
        });
    }
    deleteOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offerId = req.params.id;
                if (!offerId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Offer ID is required"));
                }
                const deletedOffer = yield this.offerServices.deleteOffer(offerId);
                if (!deletedOffer) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Offer not found"));
                }
                res.status(OK).json(responseModel_1.ResponseModel.success("Offer deleted successfully"));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('Internal server error', error));
            }
        });
    }
    updateOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offerId = req.params.id;
                const updatedData = req.body;
                if (!offerId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Offer ID is required."));
                }
                if (!updatedData.offerName || !updatedData.discount || !updatedData.startDate || !updatedData.endDate) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("All fields except description are required."));
                }
                if (updatedData.discount <= 0) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Discount must be greater than 0."));
                }
                const today = new Date().toISOString().split("T")[0];
                if (updatedData.startDate < today) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Start date must be today or later."));
                }
                if (updatedData.endDate <= updatedData.startDate) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("End date must be after the start date."));
                }
                const updatedOffer = yield this.offerServices.updateOffer(offerId, updatedData);
                if (!updatedOffer) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("Offer not found."));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success("Offer updated successfully."));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("Internal server error", error));
            }
        });
    }
    applyOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bikeId, offerId } = req.body;
                if (!bikeId || !offerId) {
                    return res.status(BAD_REQUEST).json({ message: "Bike ID and Offer ID are required." });
                }
                yield this.offerServices.findBikeAndOffer(bikeId, offerId);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Bike updated successfully"));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("Internal server error", error));
            }
        });
    }
    removeOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bikeId } = req.body;
                yield this.offerServices.removeOffer(bikeId);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Offer remove from Bike successfully"));
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error("Internal server error", error));
            }
        });
    }
}
exports.OfferController = OfferController;
exports.default = OfferController;

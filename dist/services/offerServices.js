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
const mongoose_1 = __importDefault(require("mongoose"));
class offerServices {
    constructor(offerRepository) {
        this.offerRepository = offerRepository;
    }
    saveOffer(newOffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const save = yield this.offerRepository.saveOffer(newOffer);
                return save;
            }
            catch (error) {
                throw error;
            }
        });
    }
    viewOffer(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.offerRepository.viewOffer(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteOffer(offerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.offerRepository.deleteOffer(offerId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOffer(offerId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.offerRepository.updateOffer(offerId, updatedData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findBikeAndOffer(bikeId, offerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bike = yield this.offerRepository.findBike(bikeId);
                console.log(11, bike);
                const offer = yield this.offerRepository.findOffer(offerId);
                console.log(22, offer);
                if (!bike || !offer) {
                    throw new Error("Bike or Offer not found");
                }
                const offerPrice = bike.rentAmount - (bike.rentAmount * (offer.discount / 100));
                console.log(333, offerPrice);
                const updatedBike = yield this.offerRepository.updateBike(bikeId, {
                    offerApplied: true,
                    offer: new mongoose_1.default.Types.ObjectId(offerId),
                    offerPrice: offerPrice
                });
                console.log("Bike updated successfully:", updatedBike);
                return updatedBike;
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeOffer(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedBike = yield this.offerRepository.updateBike(bikeId, {
                    offerApplied: false,
                    offer: undefined,
                    offerPrice: 0
                });
                return updatedBike;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = offerServices;

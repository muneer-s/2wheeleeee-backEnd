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
const offerModel_1 = __importDefault(require("../models/offerModel"));
const bikeModel_1 = __importDefault(require("../models/bikeModel"));
class offerRepository {
    constructor() {
        this.offerRepository = new baseRepository_1.default(offerModel_1.default);
        this.bikeRepository = new baseRepository_1.default(bikeModel_1.default);
    }
    saveOffer(newOffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.offerRepository.create(newOffer);
            }
            catch (error) {
                throw error;
            }
        });
    }
    viewOffer(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.offerRepository.find({ offerBy: userId });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteOffer(offerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bikesWithOffer = yield this.bikeRepository.find({ offer: offerId });
                console.log('bikes with offers : ', bikesWithOffer);
                if (bikesWithOffer.length > 0) {
                    yield this.bikeRepository.updateMany({ offer: offerId }, {
                        $set: {
                            offer: null,
                            offerApplied: false,
                            offerPrice: null,
                        },
                    });
                }
                return yield this.offerRepository.findByIdAndDelete(offerId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOffer(offerId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bikesWithOffer = yield this.bikeRepository.find({ offer: offerId });
                console.log('bikes with offers : ', bikesWithOffer);
                if (!updatedData.discount) {
                    throw new Error("Discount value is required to update the offer price");
                }
                const newDiscount = updatedData.discount;
                yield Promise.all(bikesWithOffer.map((bike) => __awaiter(this, void 0, void 0, function* () {
                    const newOfferPrice = bike.rentAmount - (bike.rentAmount * (newDiscount / 100));
                    yield this.bikeRepository.updateMany({ offer: offerId }, {
                        $set: {
                            offerPrice: newOfferPrice,
                        },
                    });
                })));
                // if (bikesWithOffer.length > 0) {
                //     await this.bikeRepository.updateMany(
                //         { offer: offerId },
                //         {
                //             $set: {
                //                 offerPrice: newOfferPrice,
                //             },
                //         }
                //     );
                // }
                return yield this.offerRepository.updateById(offerId, updatedData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findBike(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.bikeRepository.findById(bikeId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findOffer(offerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.offerRepository.findById(offerId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateBike(bikeId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.bikeRepository.updateById(bikeId, updateData);
            }
            catch (error) {
                console.error("Error updating bike:", error);
                throw new Error("Failed to update bike");
            }
        });
    }
}
exports.default = offerRepository;

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
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
const stream_1 = require("stream");
const mongoose_1 = __importDefault(require("mongoose"));
const responseModel_1 = require("../utils/responseModel");
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } = httpStatusCodes_1.STATUS_CODES;
class HostServices {
    constructor(hostRepository, userRepository) {
        this.hostRepository = hostRepository;
        this.userRepository = userRepository;
    }
    saveBikeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const files = req.files;
                const images = (files === null || files === void 0 ? void 0 : files.images) || [];
                const rcImage = (_a = files === null || files === void 0 ? void 0 : files.rcImage) === null || _a === void 0 ? void 0 : _a[0];
                const PolutionImage = (_b = files === null || files === void 0 ? void 0 : files.PolutionImage) === null || _b === void 0 ? void 0 : _b[0];
                const insuranceImage = (_c = files === null || files === void 0 ? void 0 : files.insuranceImage) === null || _c === void 0 ? void 0 : _c[0];
                const uploadToCloudinary = (buffer, folder) => {
                    return new Promise((resolve, reject) => {
                        const readableStream = new stream_1.Readable();
                        readableStream.push(buffer);
                        readableStream.push(null);
                        const uploadStream = cloudinaryConfig_1.default.uploader.upload_stream({ folder, resource_type: "image" }, (error, result) => {
                            if (error)
                                return reject(error);
                            resolve(result);
                        });
                        readableStream.pipe(uploadStream);
                    });
                };
                const imageUploadPromises = images.map((image) => uploadToCloudinary(image.buffer, "bikes/images"));
                const rcImageUploadPromise = rcImage
                    ? uploadToCloudinary(rcImage.buffer, "bikes/rc_images")
                    : null;
                const PolutionImageUploadPromise = PolutionImage
                    ? uploadToCloudinary(PolutionImage.buffer, "bikes/Polution_images")
                    : null;
                const insuranceImageUploadPromise = insuranceImage
                    ? uploadToCloudinary(insuranceImage.buffer, "bikes/insurance_images")
                    : null;
                const uploadedImages = yield Promise.all(imageUploadPromises);
                const uploadedRcImage = rcImageUploadPromise
                    ? yield rcImageUploadPromise
                    : null;
                const uploadedPolutionImage = PolutionImageUploadPromise
                    ? yield PolutionImageUploadPromise
                    : null;
                const uploadedInsuranceImage = insuranceImageUploadPromise
                    ? yield insuranceImageUploadPromise
                    : null;
                if (!req.userId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("User ID is required"));
                }
                const location = req.body.location;
                console.log(333, location);
                const bikeData = {
                    userId: new mongoose_1.default.Types.ObjectId(req.userId),
                    companyName: req.body.companyName,
                    modelName: req.body.modelName,
                    rentAmount: req.body.rentAmount,
                    fuelType: req.body.fuelType,
                    registerNumber: req.body.registerNumber,
                    insuranceExpDate: req.body.insuranceExpDate,
                    polutionExpDate: req.body.polutionExpDate,
                    images: uploadedImages.map((image) => image.secure_url),
                    rcImage: (uploadedRcImage === null || uploadedRcImage === void 0 ? void 0 : uploadedRcImage.secure_url) || null,
                    PolutionImage: (uploadedPolutionImage === null || uploadedPolutionImage === void 0 ? void 0 : uploadedPolutionImage.secure_url) || null,
                    insuranceImage: (uploadedInsuranceImage === null || uploadedInsuranceImage === void 0 ? void 0 : uploadedInsuranceImage.secure_url) || null,
                    isEdit: false,
                    offer: null,
                    offerApplied: false,
                    offerPrice: null,
                    location: location
                };
                console.log(321, bikeData);
                const savedBike = yield this.hostRepository.saveBikeDetails(bikeData);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Bike details saved successfully", { data: savedBike }));
            }
            catch (error) {
                console.error("Error uploading images or saving bike details:", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    isAdminVerifyUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.hostRepository.isAdminVerifyUser(userId);
                return findUser;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchBikeData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId)
                    throw new Error("User ID is undefined");
                const bikes = yield this.hostRepository.fetchBikeData(userId);
                return bikes;
            }
            catch (error) {
                console.error("Error in service layer:", error);
                throw error;
            }
        });
    }
    bikeSingleView(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bike = yield this.hostRepository.bikeSingleView(bikeId);
                return bike;
            }
            catch (error) {
                console.error("Error in service layer:", error);
                throw error;
            }
        });
    }
    deleteBike(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.hostRepository.deleteBike(bikeId);
                return result;
            }
            catch (error) {
                console.error("Error in service layer:", error);
                throw error;
            }
        });
    }
    editBike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { bikeId } = req.query;
                if (!bikeId || typeof bikeId !== "string") {
                    return res.status(BAD_REQUEST).json({ success: false, message: "Bike ID is required and must be a string." });
                }
                const { insuranceExpDate, polutionExpDate } = req.body;
                let insuranceImageUrl = "";
                let PolutionImageUrl = "";
                const files = req.files;
                if ((_a = files === null || files === void 0 ? void 0 : files.insuranceImage) === null || _a === void 0 ? void 0 : _a[0]) {
                    const insuranceImage = files.insuranceImage[0];
                    const result = yield new Promise((resolve, reject) => {
                        cloudinaryConfig_1.default.uploader.upload_stream({ folder: "bike-insurance" }, (error, result) => {
                            if (error)
                                reject(error);
                            else
                                resolve(result);
                        }).end(insuranceImage.buffer);
                    });
                    insuranceImageUrl = result.secure_url;
                }
                if ((_b = files === null || files === void 0 ? void 0 : files.PolutionImage) === null || _b === void 0 ? void 0 : _b[0]) {
                    const PolutionImage = files.PolutionImage[0];
                    const result = yield new Promise((resolve, reject) => {
                        cloudinaryConfig_1.default.uploader.upload_stream({ folder: "bike-pollution" }, (error, result) => {
                            if (error)
                                reject(error);
                            else
                                resolve(result);
                        }).end(PolutionImage.buffer);
                    });
                    PolutionImageUrl = result.secure_url;
                }
                const bike = yield this.hostRepository.editBike(new Date(insuranceExpDate), new Date(polutionExpDate), insuranceImageUrl, PolutionImageUrl, bikeId);
                return res.status(OK).json({ success: true, bike });
            }
            catch (error) {
                console.error("Error in service layer edit bike:", error);
                throw error;
            }
        });
    }
    findOrder(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.hostRepository.getOrder(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    orderDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.hostRepository.findOrder(orderId);
                if (!order) {
                    throw new Error("Order not found");
                }
                const bike = yield this.hostRepository.bikeSingleView(order === null || order === void 0 ? void 0 : order.bikeId.toString());
                if (!bike) {
                    throw new Error("Bike details not found");
                }
                const user = yield this.hostRepository.findUser(order === null || order === void 0 ? void 0 : order.userId.toString());
                if (!user) {
                    throw new Error("User details not found");
                }
                return {
                    order,
                    bike,
                    user,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = HostServices;

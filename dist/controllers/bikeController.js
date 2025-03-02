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
exports.HostController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const responseModel_1 = require("../utils/responseModel");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatusCodes_1.STATUS_CODES;
class HostController {
    constructor(HostServices) {
        this.HostServices = HostServices;
    }
    saveBikeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { insuranceExpDate, polutionExpDate } = req.body;
                if (!insuranceExpDate || !polutionExpDate) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Insurance and Polution expiration dates are required."));
                }
                const sixMonthsFromNow = new Date();
                sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
                if (new Date(insuranceExpDate) <= sixMonthsFromNow || new Date(polutionExpDate) <= sixMonthsFromNow) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Insurance and Polution expiration dates must be greater than six months from today's date."));
                }
                yield this.HostServices.saveBikeDetails(req, res);
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    isAdminVerifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const findUser = yield this.HostServices.isAdminVerifyUser(userId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('Checked', { user: findUser }));
            }
            catch (error) {
                console.log(error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    fetchBikeData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                if (!userId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("User ID is required"));
                }
                const findUserAndBikes = yield this.HostServices.fetchBikeData(userId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('', { userAndbikes: findUserAndBikes }));
            }
            catch (error) {
                console.error("Error fetching bike data:", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    bikeSingleView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bikeId = req.query.bikeId;
                if (!bikeId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Bike Id is required"));
                }
                const findBike = yield this.HostServices.bikeSingleView(bikeId);
                return res.status(OK).json(responseModel_1.ResponseModel.success('', { bike: findBike }));
            }
            catch (error) {
                console.error("Error fetching single bike  data:", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    deleteBike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bikeId = req.query.bikeId;
                if (!bikeId) {
                    return res.status(BAD_REQUEST).json(responseModel_1.ResponseModel.error("Bike Id is required"));
                }
                yield this.HostServices.deleteBike(bikeId);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Bike Deleted Successfully"));
            }
            catch (error) {
                console.error("Error deleting bike  data:", error);
                return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete  bike data" });
            }
        });
    }
    editBike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bikeId } = req.query;
                if (!bikeId) {
                    return res.status(BAD_REQUEST).json({ success: false, message: "Bike ID is required." });
                }
                return yield this.HostServices.editBike(req, res);
            }
            catch (error) {
                console.error("Error editing bike  data:", error);
                return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to editing  bike data" });
            }
        });
    }
    getOrderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Id } = req.query;
                if (!Id) {
                    return res.status(NOT_FOUND).json(responseModel_1.ResponseModel.error("User ID is required"));
                }
                const orders = yield this.HostServices.findOrder(Id.toString());
                if (!orders) {
                    return res.status(OK).json(responseModel_1.ResponseModel.success('No orders found for this user', { orders: [] }));
                }
                return res.status(OK).json(responseModel_1.ResponseModel.success('Order List Getting Success', { order: orders || [] }));
            }
            catch (error) {
                console.log("error in admin controller getting order list : ", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
    getOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderDetails = yield this.HostServices.orderDetails(req.params.orderId);
                return res.status(OK).json(responseModel_1.ResponseModel.success("Order Details Get", orderDetails));
            }
            catch (error) {
                console.log("error in admin controller getting order details : ", error);
                return res.status(INTERNAL_SERVER_ERROR).json(responseModel_1.ResponseModel.error('INTERNAL SERVER ERROR', error));
            }
        });
    }
}
exports.HostController = HostController;
exports.default = HostController;

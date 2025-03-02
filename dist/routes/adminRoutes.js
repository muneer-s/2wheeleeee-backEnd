"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminAuthMiddleware_1 = require("../Middleware/adminAuthMiddleware");
const adminServices_1 = __importDefault(require("../services/adminServices"));
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
const repository = new adminRepository_1.default();
const adminServices = new adminServices_1.default(repository);
const adminController = new adminController_1.AdminController(adminServices);
const adminRouter = express_1.default.Router();
adminRouter
    .post('/login', (req, res) => { adminController.login(req, res); })
    .get('/logout', (req, res) => { adminController.logout(req, res); })
    .get('/getAllUsers', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.getAllUsers(req, res); })
    .get('/getSingleUser/:id', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.getSingleUser(req, res); })
    .put('/userVerify/:id', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.userVerify(req, res); })
    .put('/userBlockUnBlock/:id', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.userBlockUnBlock(req, res); })
    .get('/getAllBikeDetails', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.getAllBikeDetails(req, res); })
    .put('/verifyHost/:id', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.verifyHost(req, res); })
    .put('/isEditOn/:id', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.isEditOn(req, res); })
    .get('/orderList', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.getOrderList(req, res); })
    .get('/OrderDetails/:orderId', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.getOrderDetails(req, res); })
    .get('/getAllFeedbacks', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.getAllFeedback(req, res); })
    .delete('/feedback/:feedbackId', adminAuthMiddleware_1.adminAuthMiddleware, (req, res) => { adminController.deleteFeedback(req, res); });
exports.default = adminRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminServices_1 = __importDefault(require("../services/adminServices"));
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
const repository = new adminRepository_1.default();
const adminServices = new adminServices_1.default(repository);
const adminController = new adminController_1.AdminController(adminServices);
const adminRouter = express_1.default.Router();
adminRouter.post('/login', (req, res) => {
    adminController.login(req, res);
});
adminRouter.get('/logout', (req, res) => {
    adminController.logout(req, res);
});
adminRouter.get('/getAllUsers', (req, res) => {
    adminController.getAllUsers(req, res);
});
adminRouter.get('/getSingleUser/:id', (req, res) => {
    adminController.getSingleUser(req, res);
});
exports.default = adminRouter;

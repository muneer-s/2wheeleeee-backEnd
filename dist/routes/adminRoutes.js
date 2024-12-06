"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminController = new adminController_1.AdminController();
const adminRouter = express_1.default.Router();
adminRouter.post('/login', (req, res) => {
    console.log('admin login routil ethi');
    adminController.login(req, res);
});
adminRouter.get('/logout', (req, res) => {
    console.log('admin log routil ethi');
    adminController.logout(req, res);
});
exports.default = adminRouter;

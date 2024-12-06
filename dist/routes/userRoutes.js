"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userServices_1 = __importDefault(require("../services/userServices"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const comparePassword_1 = __importDefault(require("../utils/comparePassword"));
const generateToken_1 = require("../utils/generateToken");
const userRepository = new userRepository_1.default();
const encrypt = new comparePassword_1.default();
const createjwt = new generateToken_1.CreateJWT();
const service = new userServices_1.default(userRepository, encrypt, createjwt);
const userController = new userController_1.UserController(service);
const userRouter = express_1.default.Router();
userRouter.post('/userSignup', (req, res) => {
    console.log(req.body);
    userController.userSignup(req, res);
});
userRouter.post('/verifyOtp', (req, res) => {
    console.log(`otp is ${req.body.otp}  `);
    userController.verifyOtp(req, res);
});
userRouter.post('/login', (req, res) => {
    userController.login(req, res);
});
userRouter.post('/resendOtp', (req, res) => {
    userController.resendOtp(req, res);
});
userRouter.put('/logout', (req, res) => {
    userController.logout(req, res);
});
userRouter.get('/getProfile', (req, res) => {
    console.log("Email received:", req.query.email);
    userController.getProfile(req, res);
});
userRouter.put('/editUser', (req, res) => {
    userController.editUser(req, res);
});
exports.default = userRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userServices_1 = __importDefault(require("../services/userServices"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const multer_1 = __importDefault(require("../config/multer"));
const userAuthMiddleware_1 = __importDefault(require("../Middleware/userAuthMiddleware"));
const multer_2 = __importDefault(require("multer"));
const otpRepository_1 = __importDefault(require("../repositories/otpRepository"));
const otpServices_1 = __importDefault(require("../services/otpServices"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("../utils/logger"));
const storage = multer_2.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const uploads = (0, multer_2.default)({ storage });
const otpRepository = new otpRepository_1.default();
const userRepository = new userRepository_1.default();
const service = new userServices_1.default(userRepository);
const otpService = new otpServices_1.default(otpRepository);
const userController = new userController_1.UserController(service, otpService);
const userRouter = express_1.default.Router();
userRouter.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.default.info(message.trim()),
    },
}));
userRouter
    .post('/userSignup', (req, res) => { userController.userSignup(req, res); })
    .post('/login', (req, res) => { userController.login(req, res); })
    .put('/logout', (req, res) => { userController.logout(req, res); })
    .post('/forgotPassword', (req, res) => { userController.forgotPassword(req, res); })
    .get('/getProfile', userAuthMiddleware_1.default, (req, res) => { userController.getProfile(req, res); })
    .put('/editUser', userAuthMiddleware_1.default, multer_1.default.single('profile_picture'), (req, res) => { userController.editUser(req, res); })
    .put('/editUserDocuments', userAuthMiddleware_1.default, uploads.fields([{ name: 'frontImage' }, { name: 'backImage' }]), (req, res) => { userController.editUserDocuments(req, res); })
    .get('/getAllBikes', (req, res) => { userController.GetBikeList(req, res); })
    .get('/getBikeDeatils/:id', (req, res) => { userController.getBikeDetails(req, res); })
    .post('/checkBlockedStatus', (req, res) => { userController.checkBlockedStatus(req, res); })
    .get('/orderList', userAuthMiddleware_1.default, (req, res) => { userController.getOrderList(req, res); })
    .get('/OrderDetails/:orderId', userAuthMiddleware_1.default, (req, res) => { userController.getOrderDetails(req, res); })
    .put('/earlyReturns/:orderId', userAuthMiddleware_1.default, (req, res) => { userController.earlyReturn(req, res); })
    .put('/returnOrder/:orderId', userAuthMiddleware_1.default, (req, res) => { userController.returnOrder(req, res); })
    .post('/submitReview', userAuthMiddleware_1.default, (req, res) => { userController.submitReview(req, res); })
    .get('/getReviews/:bikeId', (req, res) => { userController.getReviews(req, res); })
    .get('/isAlreadyBooked/:bikeId', userAuthMiddleware_1.default, (req, res) => { userController.isBikeAlreadyBooked(req, res); });
exports.default = userRouter;

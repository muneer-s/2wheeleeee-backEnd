"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bikeController_1 = __importDefault(require("../controllers/bikeController"));
const bikeServices_1 = __importDefault(require("../services/bikeServices"));
const bikeRepository_1 = __importDefault(require("../repositories/bikeRepository"));
const multer_1 = __importDefault(require("multer"));
const userAuthMiddleware_1 = __importDefault(require("../Middleware/userAuthMiddleware"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const userRepository = new userRepository_1.default();
const hostRepository = new bikeRepository_1.default();
const service = new bikeServices_1.default(hostRepository, userRepository);
const hostController = new bikeController_1.default(service);
const hostRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
hostRouter
    .post('/saveBikeDetails', userAuthMiddleware_1.default, upload.fields([
    { name: 'images', maxCount: 4 },
    { name: 'rcImage', maxCount: 1 },
    { name: 'PolutionImage', maxCount: 1 },
    { name: 'insuranceImage', maxCount: 1 },
]), (req, res) => { hostController.saveBikeDetails(req, res); })
    .get('/isAdminVerifyUser', userAuthMiddleware_1.default, (req, res) => { hostController.isAdminVerifyUser(req, res); })
    .get('/fetchBikeData', userAuthMiddleware_1.default, (req, res) => { hostController.fetchBikeData(req, res); })
    .get('/bikeSingleView', userAuthMiddleware_1.default, (req, res) => { hostController.bikeSingleView(req, res); })
    .delete('/deleteBike', userAuthMiddleware_1.default, (req, res) => { hostController.deleteBike(req, res); })
    .put('/editBike', userAuthMiddleware_1.default, upload.fields([{ name: 'insuranceImage', maxCount: 1 }, { name: 'polutionImage', maxCount: 1 }]), (req, res) => { hostController.editBike(req, res); })
    .get('/orderList', userAuthMiddleware_1.default, (req, res) => { hostController.getOrderList(req, res); })
    .get('/OrderDetails/:orderId', userAuthMiddleware_1.default, (req, res) => { hostController.getOrderDetails(req, res); });
exports.default = hostRouter;
/*
hostRouter.post('/saveBikeDetails', userAuth, upload.fields([
    { name: "images", maxCount: 4 },
    { name: "rcImage", maxCount: 1 },
    { name: "PolutionImage", maxCount: 1 },
    { name: "insuranceImage", maxCount: 1 },
]), (req, res) => {
    hostController.saveBikeDetails(req, res)
});

hostRouter.get('/isAdminVerifyUser', userAuth, (req, res) => {
    hostController.isAdminVerifyUser(req, res)
})

hostRouter.get('/fetchBikeData', userAuth, (req, res) => {
    hostController.fetchBikeData(req, res)
})

hostRouter.get('/bikeSingleView', userAuth, (req, res) => {
    hostController.bikeSingleView(req, res)
})

hostRouter.delete('/deleteBike', userAuth, (req, res) => {
    hostController.deleteBike(req, res)
})

// hostRouter.put('/editBike', userAuth, (req, res) => {
//     hostController.editBike(req, res)
// })

hostRouter.put("/editBike", userAuth, upload.fields([
    { name: "insuranceImage", maxCount: 1 },
    { name: "polutionImage", maxCount: 1 }
]), (req, res) => {
    hostController.editBike(req, res)
});

*/

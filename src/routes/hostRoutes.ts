import express from 'express';
import HostController from '../controllers/bikeController';
import HostServices from '../services/bikeServices';
import HostRepository from '../repositories/bikeRepository';
import multer from 'multer';
import userAuth from '../middleware/userAuthMiddleware';



const hostRepository = new HostRepository()
const service = new HostServices(hostRepository)
const hostController = new HostController(service)



const hostRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


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



export default hostRouter;
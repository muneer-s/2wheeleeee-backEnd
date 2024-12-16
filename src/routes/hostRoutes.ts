import express from 'express';
import HostController from '../controllers/hostController';
import HostServices from '../services/hostServices';
import HostRepository from '../repositories/hostRepository';
import multer from 'multer';






const hostRepository = new HostRepository()
const service = new HostServices(hostRepository)
const hostController = new HostController(service)



const hostRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for demo


hostRouter.post('/saveBikeDetails', upload.fields([
    { name: "images", maxCount: 4 },
    { name: "rcImage", maxCount: 1 },
    { name: "insuranceImage", maxCount: 1 },
]), (req, res) => {

    hostController.saveBikeDetails(req, res)
});


export default hostRouter;
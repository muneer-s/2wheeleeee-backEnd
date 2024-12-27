import express from 'express';
import HostController from '../controllers/hostController';
import HostServices from '../services/hostServices';
import HostRepository from '../repositories/hostRepository';
import multer from 'multer';
import userAuth from '../Middleware/userAuthMiddleware';






const hostRepository = new HostRepository()
const service = new HostServices(hostRepository)
const hostController = new HostController(service)



const hostRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); 


hostRouter.post('/saveBikeDetails',userAuth, upload.fields([
    { name: "images", maxCount: 4 },
    { name: "rcImage", maxCount: 1 },
    { name: "insuranceImage", maxCount: 1 },
]), (req, res) => {

    hostController.saveBikeDetails(req, res)
});

hostRouter.get('/isAdminVerifyUser',userAuth,(req,res)=>{
    hostController.isAdminVerifyUser(req,res)
})


export default hostRouter;
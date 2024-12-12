
import express from 'express';
import { AdminController } from '../controllers/adminController';
import { adminAuthMiddleware } from '../config/adminAuthMiddleware';
import AdminServices from '../services/adminServices';
import AdminRepository from '../repositories/adminRepository';


const repository = new AdminRepository()
const adminServices = new AdminServices(repository);
const adminController = new AdminController(adminServices);
const adminRouter = express.Router();

adminRouter.post('/login', (req, res) => {
        adminController.login(req, res);
});

adminRouter.get('/logout', (req, res) => {
        adminController.logout(req, res);
});

adminRouter.get('/getAllUsers', (req, res) => {
        adminController.getAllUsers(req, res)
})

adminRouter.get('/getSingleUser/:id', (req, res) => {
        adminController.getSingleUser(req,res)
})

adminRouter.put('/userVerify/:id',(req,res)=>{
        adminController.userVerify(req,res)
})










export default adminRouter;


import express from 'express';
import { AdminController } from '../controllers/adminController';
import { adminAuthMiddleware } from '../config/adminAuthMiddleware';

const adminController = new AdminController();
const adminRouter = express.Router();

adminRouter.post('/login',  (req, res) => {
        console.log('admin login routil ethi');
        adminController.login(req, res);
});

adminRouter.get('/logout',  (req, res) => {
    console.log('admin log routil ethi');
     adminController.logout(req, res);
});

export default adminRouter;

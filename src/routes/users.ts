
import express from 'express';
import { UserController } from '../controllers/userController';

const userController=new UserController()


const userRouter = express.Router();

userRouter.get('/users/:id', (req, res) => userController.getUser(req, res));

export default userRouter;
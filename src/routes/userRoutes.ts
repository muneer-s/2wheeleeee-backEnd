import express from 'express';
import { UserController } from '../controllers/userController';
import UserServices from '../services/userServices';
import UserRepository from '../repositories/userRepository';
import Encrypt from '../utils/comparePassword';
import { CreateJWT } from '../utils/generateToken';



const userRepository = new UserRepository()
const encrypt = new Encrypt()
const createjwt = new CreateJWT()
const service = new UserServices(userRepository,encrypt,createjwt)

const userController = new UserController(service)



const userRouter = express.Router();


userRouter.post('/userSignup', (req, res) => {
    console.log(req.body);
    
    userController.userSignup(req, res)
});

export default userRouter;
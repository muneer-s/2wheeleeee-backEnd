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


userRouter.post('/userSignup', (req , res) => {
    console.log(req.body);
    userController.userSignup(req, res)
});

userRouter.post('/verifyOtp',(req,res)=>{
    console.log(`otp is ${req.body.otp}  `);
    userController.verifyOtp(req,res)
    
})

userRouter.post('/login',(req,res)=>{    
    userController.login(req,res)
})
                
userRouter.post('/resendOtp',(req,res)=>{
    userController.resendOtp(req,res)
})

userRouter.put('logout',(req,res)=>{    
    userController.logout(req,res)
})





export default userRouter;
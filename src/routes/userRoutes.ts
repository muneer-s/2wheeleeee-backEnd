import express from 'express';
import { UserController } from '../controllers/userController';
import UserServices from '../services/userServices';
import UserRepository from '../repositories/userRepository';
import Encrypt from '../utils/comparePassword';
import { CreateJWT } from '../utils/generateToken';
import upload from '../config/multer';
import userAuth from '../middleware/userAuthMiddleware';

import multer from 'multer';
import OtpRepository from '../repositories/otpRepository';
import OtpServices from '../services/otpServices';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); 
    },
});
const uploads = multer({ storage });



const otpRepository = new OtpRepository();
const userRepository = new UserRepository()
const encrypt = new Encrypt()
const createjwt = new CreateJWT()

const service = new UserServices(userRepository)
const otpService = new OtpServices(otpRepository)
const userController = new UserController(service,otpService)



const userRouter = express.Router();

 
userRouter.post('/userSignup', (req , res) => {
    console.log(req.body);
    userController.userSignup(req, res)
});

// userRouter.post('/verifyOtp',(req,res)=>{
//     console.log(`otp is ${req.body.otp}  `);
//     userController.verifyOtp(req,res)
    
// })

userRouter.post('/login',(req,res)=>{    
    userController.login(req,res)
})
                
userRouter.put('/logout',(req,res)=>{    
    userController.logout(req,res)
})

userRouter.post('/forgotPassword',(req,res)=>{
    userController.forgotPassword(req,res)
})

userRouter.get('/getProfile',userAuth, (req, res) => {
    userController.getProfile(req, res);
});

userRouter.put('/editUser',userAuth,upload.single("profile_picture"),(req,res)=>{        
    userController.editUser(req,res)
})

userRouter.put('/editUserDocuments',userAuth,uploads.fields([{ name: 'frontImage' }, { name: 'backImage' }]),(req,res)=>{
    userController.editUserDocuments(req,res)
})

userRouter.get('/getAllBikes', (req, res) => {
    userController.GetBikeList(req, res);
  });

userRouter.get('/getBikeDeatils/:id', (req, res) => {
    // console.log("Route hit with ID:", req.params.id);
    userController.getBikeDeatils(req, res);
});





export default userRouter;
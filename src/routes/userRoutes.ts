import express from 'express';
import { UserController } from '../controllers/userController';
import UserServices from '../services/userServices';
import UserRepository from '../repositories/userRepository';
import Encrypt from '../utils/comparePassword';
import { CreateJWT } from '../utils/generateToken';
import upload from '../config/multer';


import multer from 'multer';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Specify the directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Save files with unique names
    },
});
const uploads = multer({ storage });




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

userRouter.put('/logout',(req,res)=>{    
    userController.logout(req,res)
})

userRouter.get('/getProfile', (req, res) => {
    userController.getProfile(req, res);
});

userRouter.put('/editUser',upload.single("profile_picture"),(req,res)=>{        
    userController.editUser(req,res)
})

userRouter.put('/editUserDocuments',uploads.fields([{ name: 'frontImage' }, { name: 'backImage' }]),(req,res)=>{
    // console.log("Files received:", req.files); 
    // console.log("Form fields:", req.body); 
    userController.editUserDocuments(req,res)
})




export default userRouter;
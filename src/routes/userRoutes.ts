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
import morgan from 'morgan';
import logger from '../utils/logger';



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

const service = new UserServices(userRepository)
const otpService = new OtpServices(otpRepository)
const userController = new UserController(service, otpService)

const userRouter = express.Router();

userRouter.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

userRouter
    .post('/userSignup', (req, res) => {
        userController.userSignup(req, res)
    })
    .post('/login', (req, res) => {
        userController.login(req, res);
    })
    .put('/logout', (req, res) => {
        userController.logout(req, res);
    })
    .post('/forgotPassword', (req, res) => {
        userController.forgotPassword(req, res);
    })
    .get('/getProfile', userAuth, (req, res) => {
        userController.getProfile(req, res);
    })
    .put('/editUser', userAuth, upload.single('profile_picture'), (req, res) => {
        userController.editUser(req, res);
    })
    .put(
        '/editUserDocuments',
        userAuth,
        uploads.fields([{ name: 'frontImage' }, { name: 'backImage' }]),
        (req, res) => {
            userController.editUserDocuments(req, res);
        }
    )
    .get('/getAllBikes', (req, res) => {
        userController.GetBikeList(req, res);
    })
    .get('/getBikeDeatils/:id', (req, res) => {
        userController.getBikeDetails(req, res);
    })
    .post('/checkBlockedStatus', (req, res) => {userController.checkBlockedStatus(req, res)})
    



/*
// userRouter.post('/userSignup', (req , res) => {
//     console.log(req.body);
//     userController.userSignup(req, res)
// });

userRouter.post('/userSignup', (req, res) => {
    logger.info(`Signup request received: ${JSON.stringify(req.body)}`);
    userController.userSignup(req, res).catch((error) => {
        logger.error(`Error in userSignup: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    });
});

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
    userController.getBikeDetails(req, res);
});


*/


export default userRouter;
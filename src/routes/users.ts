
import express from 'express';
import { UserController } from '../controllers/userController';

const userController=new UserController()



  
  
const userRouter = express.Router();


userRouter.post('/register', (req, res) => {
    console.log(req.body);
    
    userController.Register(req, res)
});

export default userRouter;
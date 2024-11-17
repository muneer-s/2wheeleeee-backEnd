import { Request, Response } from 'express';
import UserServices from '../services/userServices';
import { generateAndSendOTP } from "../utils/otpGenerator";
import { STATUS_CODES } from "../constants/httpStatusCodes";


const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;


export class UserController {
  
  constructor(private UserServices: UserServices) { 

  }

  milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);


  // public Register = async (req: Request, res: Response) => {
  //   const user =12 
    
  // };

  async userSignup(req: Request, res: Response): Promise<void> {
    try {
        req.app.locals.userData = req.body;
        const newUser = await this.UserServices.userSignup(req.app.locals.userData);
        if (!newUser) {
            req.app.locals.newUser = true;
            req.app.locals.userData = req.body;
            req.app.locals.userEmail = req.body.email;
            const otp = await generateAndSendOTP(req.body.email);
            req.app.locals.userOtp = otp;
            const expirationMinutes = 5;
            setTimeout(() => {
                delete req.app.locals.userOtp;
            }, expirationMinutes * 60 * 1000);

            res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });

        } else {
            res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
        }
    } catch (error) {
        console.log(error as Error)
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
    }
}




}

export default UserController;


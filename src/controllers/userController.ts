import { Request, Response } from 'express';
import UserServices from '../services/userServices';
import { generateAndSendOTP } from "../utils/otpGenerator";
import { STATUS_CODES } from "../constants/httpStatusCodes";


const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;


export class UserController {
  
  constructor(private UserServices: UserServices) { 

  }

  milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

  async userSignup(req: Request, res: Response): Promise<void> {
    try {
        req.app.locals.userData = req.body;
        const newUser = await this.UserServices.userSignup(req.app.locals.userData);
        if (!newUser) {
            await generateAndSendOTP(req.body.email);
            const saveData = await this.UserServices.saveUser(req.body);
            console.log(saveData);
            res.status(OK).json({ userId: req.body.email, success: true, message: 'OTP sent for verification...' });
        } else {            
            res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
        }
    } catch (error) {
        console.log(error as Error)
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
    }
}

async verifyOtp(req:Request,res:Response){
    let otp = req.body
    console.log('otp is -----',otp );
    

}




}

export default UserController;


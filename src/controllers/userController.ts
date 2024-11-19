import { Request, Response } from 'express';
import UserServices from '../services/userServices';
import { generateAndSendOTP } from "../utils/otpGenerator";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import userModel from '../models/userModels';


const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;


export class UserController {

    constructor(private UserServices: UserServices) {

    }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userSignup(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;
            const newUser = await this.UserServices.userSignup(userData);
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

    async verifyOtp(req: Request, res: Response) {
        try {
            let data = req.body
            console.log('otp is -----', data);
            const otpMatched = await this.UserServices.verifyOtp(data)

            if (otpMatched) {
                const userEmail = data.userId

                let userDetails = await userModel.findOne(
                    { email: userEmail },
                    'email name profile_picture'
                  );

                console.log("user details : " ,userDetails);
                res.status(OK).json({ userId: userDetails, success: true, message: 'OTP verification successful, account verified.' });
            }else{
                res.status(BAD_REQUEST).json({ success: false, message: 'OTP verification failed!' });

            }
        } catch (error) {
            console.log(error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });

        }


    }




}

export default UserController;


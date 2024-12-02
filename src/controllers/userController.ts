import { Request, Response } from 'express';
import UserServices from '../services/userServices';
import { generateAndSendOTP } from "../utils/otpGenerator";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import userModel from '../models/userModels';


const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;


export class UserController {

    constructor(private UserServices: UserServices) {

    }

    //milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userSignup(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;

            const userFound = await this.UserServices.userSignup(userData);


            if (userFound == false) {
                await generateAndSendOTP(req.body.email);
                const saveData = await this.UserServices.saveUser(req.body);
                console.log('saved data: ',saveData);
                res.status(OK).json({ userId: req.body.email, success: true, message: 'OTP sent for verification...' });
            } else {
                console.log('user already nd , so onnum cheyyanda , resposne sended to front end ');
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
            const otpMatched = await this.UserServices.verifyOtp(data)

            if (otpMatched) {
                const userEmail = data.userId

                let userDetails = await userModel.findOne(
                    { email: userEmail },
                    'email name profile_picture'
                );

                console.log("user details : ", userDetails);
                res.status(OK).json({ userId: userDetails, success: true, message: 'OTP verification successful, account verified.' });
            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'OTP verification failed!' });

            }
        } catch (error) {
            console.log(error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const isUserPresent = await this.UserServices.login(email)
            console.log('user present in controoler : ', isUserPresent);

            if (!isUserPresent) {
                return res.status(404).json({ success: false, message: 'There is no such user with this email' });
            }
            const isPasswordMatch = await isUserPresent.matchPassword(password);
            console.log('password same aamno : ', isPasswordMatch);

            if (!isPasswordMatch) {
                return res.status(400).json({ success: false, message: 'Invalid email or password' });
            }
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    email: isUserPresent.email,
                    name: isUserPresent.name,
                    profile_picture: isUserPresent.profile_picture,
                },
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });

        }
    }

    async resendOtp(req:Request,res:Response){
        try {
            console.log('resend otp req : ',req.body);
            const email = req.body.email
            console.log(email);

            const otp = await generateAndSendOTP(email);
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });

        }
    }

    async logout(req:Request,res:Response){
        try {
            console.log('logout ethi :only cookies clrear cheyyal aanu vendath ',req.body.email);
            
        } catch (error) {
            console.log(error);
            
        }
    }


}

export default UserController;


import { Request, Response } from 'express';
import OtpServices from '../services/otpServices';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import userModel from '../models/userModels';
import { CreateJWT } from '../utils/generateToken';
import { IOtpService } from '../interfaces/otp/IOtpService';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;
const jwtHandler = new CreateJWT()


export class OtpController {

    constructor(private OtpServices: IOtpService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async verifyOtp(req: Request, res: Response): Promise<Response | void> {
        try {
            let data = req.body
            const otpMatched = await this.OtpServices.verifyOtp(data)

            if (otpMatched) {
                const userEmail = data.userId

                let userDetails = await userModel.findOne(
                    { email: userEmail },
                    'email name profile_picture _id'
                );


                if (!userDetails) {
                    return res.status(BAD_REQUEST).json({
                        success: false,
                        message: 'User not found!',
                    });
                }

                const time = this.milliseconds(0, 30, 0);
                const refreshTokenExpiryTime = this.milliseconds(48, 0, 0);

                const userAccessToken = jwtHandler.generateToken(userDetails?._id.toString());
                const userRefreshToken = jwtHandler.generateRefreshToken(userDetails?._id.toString());

                res.status(OK).cookie('user_access_token', userAccessToken, {
                    expires: new Date(Date.now() + time),
                    sameSite: 'strict',
                }).cookie('user_refresh_token', userRefreshToken, {
                    expires: new Date(Date.now() + refreshTokenExpiryTime),
                    sameSite: 'strict',
                }).json({ userData: userDetails, userAccessToken: userAccessToken, userRefreshToken: userRefreshToken, success: true, message: 'OTP verification successful, account verified.' });

            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'OTP verification failed!' });
            }
        } catch (error) {
            console.log(error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<Response | void> {
        try {
            const email = req.body.email
            //const otp = await generateAndSendOTP(email);
            await this.OtpServices.generateAndSendOtp(email);
            return res.status(200).json({ success: true, message: 'OTP resent successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });

        }
    }

}

export default OtpController;


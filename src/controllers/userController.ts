import { Request, Response } from 'express';
import UserServices from '../services/userServices';
import { generateAndSendOTP } from "../utils/otpGenerator";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import userModel from '../models/userModels';
import { CreateJWT } from '../utils/generateToken';


const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;
const jwtHandler = new CreateJWT()


export class UserController {

    constructor(private UserServices: UserServices) {

    }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userSignup(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;

            const userFound = await this.UserServices.userSignup(userData);


            if (userFound == false) {
                await generateAndSendOTP(req.body.email);
                const saveData = await this.UserServices.saveUser(req.body);
                console.log('saved data: ', saveData);
                res.status(OK).json({ email: req.body.email, success: true, message: 'OTP sent for verification...' });
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
                    'email name profile_picture _id'
                );
                console.log('user details in verify otp , ',userDetails);


                if (!userDetails) {
                    return res.status(BAD_REQUEST).json({
                        success: false,
                        message: 'User not found!',
                    });
                }
                

                const time = this.milliseconds(23, 30, 0);
                const userAccessToken = jwtHandler.generateToken(userDetails?._id.toString());
                const userRefreshToken = jwtHandler.generateRefreshToken(userDetails?._id.toString());

                console.log("user details : ", userDetails);
                res.status(OK).cookie('user_access_token', userAccessToken, {
                    expires: new Date(Date.now() + time),
                    sameSite: 'strict',
                }).cookie('user_refresh_token', userRefreshToken, {
                    expires: new Date(Date.now() + time),
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

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const isUserPresent = await this.UserServices.login(email)
console.log('is user present',isUserPresent);

            if (!isUserPresent) {
                return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' });
            }
            const isPasswordMatch = await isUserPresent.matchPassword(password);

            if (!isPasswordMatch) {
                return res.status(400).json({ success: false, message: 'Incorrect password. Please try again.' });
            }

            const time = this.milliseconds(23, 30, 0);
            const userAccessToken = jwtHandler.generateToken(isUserPresent._id.toString());
            const userRefreshToken = jwtHandler.generateRefreshToken(isUserPresent._id.toString());

            return res.status(200).cookie('user_access_token', userAccessToken, {
                expires: new Date(Date.now() + time),
                sameSite: 'strict',
            }).json({
                success: true,
                message: 'Login successful',
                user: {
                    email: isUserPresent.email,
                    name: isUserPresent.name,
                    profile_picture: isUserPresent.profile_picture,
                    userId:isUserPresent._id
                },
                userAccessToken,
                userRefreshToken
            });
        } catch (error) {
            console.log('Error during login:', error);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });

        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            console.log('resend otp req : ', req.body);
            const email = req.body.email
            console.log(email);

            const otp = await generateAndSendOTP(email);

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });

        }
    }

    async logout(req: Request, res: Response) {
        try {
            console.log('logout ethi :only cookies clrear cheyyal aanu vendath ', req.body.email);

            res.cookie('user_access_token', '', {
                httpOnly: true,
                expires: new Date(0)
            }).cookie('user_refresh_token', '', {
                httpOnly: true,
                expires: new Date(0)
            }).status(OK).json({ success: true, message: 'Logged out successfully' });

        } catch (error) {
            console.log(error);

        }
    }
    async getProfile(req: Request, res: Response) {
        try {
            console.log('get profilil ethiiii');
            const email = req.query.email ?? ''; // Use a default value if email is undefined

            if (!email || typeof email !== 'string') {
                return res.status(BAD_REQUEST).json({ success: false, message: 'Invalid email provided' });
            }

            const userDetails = await this.UserServices.getProfile(email);

            console.log('userd dataaa:    ', userDetails);


            res.status(OK).json({ success: true, userDetails });
        } catch (error) {
            console.log(error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    async editUser(req: Request, res: Response) {
        try {
            const { email, ...userData } = req.body; 
            console.log('User email:', email);
            console.log('User data:', userData);

            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            const updatedUserData = await this.UserServices.editProfile(email,userData)

            if (!updatedUserData) {
                return res.status(404).json({ message: "User not found" });
            }
    
            res.status(200).json({
                message: "User profile updated successfully",
                data: updatedUserData,
            });


        } catch (error) {
            console.error("Controller error updating profile:", error);
            res.status(500).json("Internal server error" );
        }
    }


}

export default UserController;


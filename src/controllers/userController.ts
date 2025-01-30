import { Request, response, Response } from 'express';
import UserServices from '../services/userServices';
import { generateAndSendOTP } from "../utils/otpGenerator";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import userModel from '../models/userModels';
import { CreateJWT } from '../utils/generateToken';
import bikeModel from '../models/bikeModel';
import OtpServices from '../services/otpServices';
import logger from '../utils/logger';
import { IUserService } from '../interfaces/user/IUserService';
import { IOtpService } from '../interfaces/otp/IOtpService';
import { ResponseModel } from '../utils/responseModel';
import { error } from 'console';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;
const jwtHandler = new CreateJWT()


export class UserController {

    constructor(private UserServices: IUserService, private OtpServices: IOtpService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userSignup(req: Request, res: Response): Promise<Response | void> {
        try {
            const userData = req.body;
            const userFound = await this.UserServices.userSignup(userData);

            // logger.info("11111111111111111")
            // logger.error(2222222222222222)

            if (!userFound) {
                await this.OtpServices.generateAndSendOtp(req.body.email)

                const userWallet = await this.UserServices.createWallet()

                userData.wallet = userWallet._id;

                if (!userWallet) {
                    return res.status(BAD_REQUEST).json(ResponseModel.error("wallet not created"))
                }

                await this.UserServices.saveUser(userData);

                return res.status(OK).json(ResponseModel.success('OTP sent for verification', { email: req.body.email }));

            } else {
                return res.status(BAD_REQUEST).json(ResponseModel.error('The email is already in use!'));
            }
        } catch (error) {
            console.log(error as Error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async login(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email, password } = req.body
            const isUserPresent = await this.UserServices.login(email)

            if (!isUserPresent) {
                return res.status(NOT_FOUND).json(ResponseModel.error('No account found with this email. Please register first.'));
            }
            const isPasswordMatch = await isUserPresent.matchPassword(password);

            if (!isPasswordMatch) {
                return res.status(400).json(ResponseModel.error('Incorrect password. Please try again.'));
            }


            if (isUserPresent.isBlocked) {
                return res.status(400).json(ResponseModel.error('User is blocked by the Admin.'));
            }

            const time = this.milliseconds(0, 30, 0);
            const refreshTokenExpiryTime = this.milliseconds(48, 0, 0); //  48 hours

            const userAccessToken = jwtHandler.generateToken(isUserPresent._id.toString());
            const userRefreshToken = jwtHandler.generateRefreshToken(isUserPresent._id.toString());


            return res.status(OK).cookie('user_access_token', userAccessToken, {
                expires: new Date(Date.now() + time),
                sameSite: 'strict',
            }).cookie('user_refresh_token', userRefreshToken, {
                expires: new Date(Date.now() + refreshTokenExpiryTime),
                sameSite: 'strict',
            }).json(
                ResponseModel.success('Login successful', {
                    user: {
                        email: isUserPresent.email,
                        name: isUserPresent.name,
                        profile_picture: isUserPresent.profile_picture,
                        userId: isUserPresent._id
                    },
                    userAccessToken,
                    userRefreshToken
                })
            );
        } catch (error) {
            console.log('Error during login:', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('An unexpected error occurred. Please try again later.', error as Error));
        }
    }

    async logout(req: Request, res: Response): Promise<Response | void> {
        try {
            return res.cookie('user_access_token', '', {
                httpOnly: true,
                expires: new Date(0)
            }).cookie('user_refresh_token', '', {
                httpOnly: true,
                expires: new Date(0)
            }).status(OK).json(ResponseModel.success('Logged out successfully'));

        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email } = req.body

            if (!email) {
                return res.status(NOT_FOUND).json({ success: false, message: "Email is required." })
            }

            


            //const forgotPassword: any = await this._userUsecase.forgotPassword(req.body.email);


            // if (forgotPassword.status == 400) {
            //     return res.status(forgotPassword.status).json(forgotPassword.message);
            // }

            // return res.status(forgotPassword.status).json(forgotPassword.message);


        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))

        }
    }

    async getProfile(req: Request, res: Response): Promise<Response | void> {
        try {
            const email = req.query.email ?? '';

            if (!email || typeof email !== 'string') {
                return res.status(BAD_REQUEST).json(ResponseModel.error('Invalid email provided'));
            }

            const userDetails = await this.UserServices.getProfile(email);

            return res.status(OK).json(ResponseModel.success('Success', userDetails));
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async editUser(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email, ...userData } = req.body;
            if (!email) {
                return res.status(NOT_FOUND).json(ResponseModel.error("Email is required"));
            }
            const updatedUserData = await this.UserServices.editProfile(email, userData, req)

            if (!updatedUserData) {
                return res.status(NOT_FOUND).json(ResponseModel.error("User not found"));
            }

            return res.status(OK).json(ResponseModel.success("User profile updated successfully", {
                data: updatedUserData,
                user: {
                    email: updatedUserData.email,
                    name: updatedUserData.name,
                    profile_picture: updatedUserData.profile_picture,
                    userId: updatedUserData._id
                },
            }))
        } catch (error) {
            console.error("Controller error updating profile:", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async editUserDocuments(req: Request, res: Response): Promise<Response | void> {
        try {
            const updatedUserDocuments = await this.UserServices.editUserDocuments(req, res)
            return res.status(OK).json(ResponseModel.success('User profile updated successfully', { data: updatedUserDocuments }))
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async GetBikeList(req: Request, res: Response): Promise<Response | void> {
        try {
            const { page = 1, limit = 10, search = '', fuelType, minRent, maxRent } = req.query;

            const result = await this.UserServices.GetBikeList({
                page: Number(page),
                limit: Number(limit),
                search: String(search),
                fuelType: String(fuelType),
                minRent: Number(minRent),
                maxRent: Number(maxRent),
            });

            return res.status(OK).json(ResponseModel.success('Get Bike List', {
                bikeList: result.bikeList,
                totalBikes: result.totalBikes,
                totalPages: result.totalPages,
            }))
        } catch (error) {
            console.error('Error in controller GetBikeList:', error);
            res.status(500).json({ success: false, message: 'Failed to get bike list' });
        }
    }

    async getBikeDetails(req: Request, res: Response): Promise<Response | void> {
        try {
            const { id } = req.params;
            const bike = await this.UserServices.getBikeDetails(id)
            if (!bike) return res.status(NOT_FOUND).json(ResponseModel.error('Bike not found'));
            return res.status(OK).json(ResponseModel.success('Bike Details', bike))
        } catch (error) {
            console.error("Error getting bike details :", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("Failed to get bike Deatils", error as Error));
        }
    }

    async checkBlockedStatus(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email } = req.body;
            const user = await this.UserServices.findUserByEmail(email)

            if (!user) {
                return res.status(NOT_FOUND).json(ResponseModel.error('User not found'));

            }

            return res.status(OK).json(ResponseModel.success('success', { isBlocked: user.isBlocked }));
        } catch (error) {
            console.error('Error checking user status:', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
        }
    }


}

export default UserController;


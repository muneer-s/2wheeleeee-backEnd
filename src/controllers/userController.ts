import { Request, Response } from 'express';
import UserServices from '../services/userServices';
import { generateAndSendOTP } from "../utils/otpGenerator";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import userModel from '../models/userModels';
import { CreateJWT } from '../utils/generateToken';
import bikeModel from '../models/bikeModel';
import OtpServices from '../services/otpServices';




const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;
const jwtHandler = new CreateJWT()


export class UserController {

    constructor(private UserServices: UserServices,private OtpServices:OtpServices) {

    }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userSignup(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;
            const userFound = await this.UserServices.userSignup(userData);



            if (userFound == false) {
                //    await generateAndSendOTP(req.body.email);
                await this.OtpServices.generateAndSendOtp(req.body.email)

                await this.UserServices.saveUser(req.body);
                res.status(OK).json({ email: req.body.email, success: true, message: 'OTP sent for verification...' });
            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
            }
        } catch (error) {
            console.log(error as Error)
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }


    // async verifyOtp(req: Request, res: Response) {
    //     try {
    //         let data = req.body
    //         const otpMatched = await this.UserServices.verifyOtp(data)

    //         if (otpMatched) {
    //             const userEmail = data.userId

    //             let userDetails = await userModel.findOne(
    //                 { email: userEmail },
    //                 'email name profile_picture _id'
    //             );


    //             if (!userDetails) {
    //                 return res.status(BAD_REQUEST).json({
    //                     success: false,
    //                     message: 'User not found!',
    //                 });
    //             }


    //             const time = this.milliseconds(0, 30, 0);
    //             const refreshTokenExpiryTime = this.milliseconds(48, 0, 0);

    //             const userAccessToken = jwtHandler.generateToken(userDetails?._id.toString());
    //             const userRefreshToken = jwtHandler.generateRefreshToken(userDetails?._id.toString());

    //             res.status(OK).cookie('user_access_token', userAccessToken, {
    //                 expires: new Date(Date.now() + time),
    //                 sameSite: 'strict',
    //             }).cookie('user_refresh_token', userRefreshToken, {
    //                 expires: new Date(Date.now() + refreshTokenExpiryTime),
    //                 sameSite: 'strict',
    //             }).json({ userData: userDetails, userAccessToken: userAccessToken, userRefreshToken: userRefreshToken, success: true, message: 'OTP verification successful, account verified.' });


    //         } else {
    //             res.status(BAD_REQUEST).json({ success: false, message: 'OTP verification failed!' });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
    //     }
    // }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const isUserPresent = await this.UserServices.login(email)

            if (!isUserPresent) {
                return res.status(NOT_FOUND).json({ success: false, message: 'No account found with this email. Please register first.' });
            }
            const isPasswordMatch = await isUserPresent.matchPassword(password);

            if (!isPasswordMatch) {
                return res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect password. Please try again.' });
            }

            console.log(111, isUserPresent);
            if (isUserPresent.isBlocked) {
                return res.status(BAD_REQUEST).json({ success: false, message: "User is Blocked by the Admin" })
            }




            const time = this.milliseconds(0, 30, 0);
            const refreshTokenExpiryTime = this.milliseconds(48, 0, 0); //  48 hours

            const userAccessToken = jwtHandler.generateToken(isUserPresent._id.toString());
            const userRefreshToken = jwtHandler.generateRefreshToken(isUserPresent._id.toString());

            return res.status(200).cookie('user_access_token', userAccessToken, {
                expires: new Date(Date.now() + time),
                sameSite: 'strict',
            }).cookie('user_refresh_token', userRefreshToken, {
                expires: new Date(Date.now() + refreshTokenExpiryTime),
                sameSite: 'strict',
            }).json({
                success: true,
                message: 'Login successful',
                user: {
                    email: isUserPresent.email,
                    name: isUserPresent.name,
                    profile_picture: isUserPresent.profile_picture,
                    userId: isUserPresent._id
                },
                userAccessToken,
                userRefreshToken
            });
        } catch (error) {
            console.log('Error during login:', error);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });

        }
    }

 

    async logout(req: Request, res: Response) {
        try {
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

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body

            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required." })
            }


        } catch (error) {
            console.log(error);

        }
    }



    async getProfile(req: Request, res: Response) {
        try {
            const email = req.query.email ?? '';

            if (!email || typeof email !== 'string') {
                return res.status(BAD_REQUEST).json({ success: false, message: 'Invalid email provided' });
            }

            const userDetails = await this.UserServices.getProfile(email);

            res.status(OK).json({ success: true, userDetails });
        } catch (error) {
            console.log(error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    async editUser(req: Request, res: Response) {
        try {
            const { email, ...userData } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            const updatedUserData = await this.UserServices.editProfile(email, userData, req)
            if (!updatedUserData) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({
                message: "User profile updated successfully",
                data: updatedUserData,
                user: {
                    email: updatedUserData.email,
                    name: updatedUserData.name,
                    profile_picture: updatedUserData.profile_picture,
                    userId: updatedUserData._id
                },
            });
        } catch (error) {
            console.error("Controller error updating profile:", error);
            res.status(500).json("Internal server error");
        }
    }



    async editUserDocuments(req: Request, res: Response) {
        try {
            const updatedUserDocuments = await this.UserServices.editUserDocuments(req, res)
            res.status(OK).json({
                message: "User profile updated successfully",
                data: updatedUserDocuments,
            });
        } catch (error) {
            console.log(error);

        }
    }

    // async GetBikeList(req:Request,res:Response){
    //     try {
    //         const { page = 1, limit = 10, search = '', fuelType, minRent, maxRent } = req.query;

    //         const query: any = {
    //             isHost: true,
    //         };


    //     // Add search filter (modelName or companyName)
    //     if (search) {
    //         query.$or = [
    //             { modelName: { $regex: search, $options: 'i' } },
    //             { companyName: { $regex: search, $options: 'i' } },
    //         ];
    //     }

    //     // Add fuel type filter
    //     if (fuelType) {
    //         query.fuelType = fuelType;
    //     }

    //     // Add rent amount filter
    //     if (minRent && maxRent) {
    //         query.rentAmount = { $gte: Number(minRent), $lte: Number(maxRent) };
    //     }

    //     // Pagination
    //     const skip = (Number(page) - 1) * Number(limit);
    //     console.log(2111111111,query)



    //     const bikeList = await this.UserServices.GetBikeList(query,skip,limit)
    //     //const bikeList = await bikeModel.find(query).skip(skip).limit(Number(limit));


    //     // Count total documents for pagination
    //     const totalBikes = await bikeModel.countDocuments(query);


    //     res.status(200).json({
    //         success: true,
    //         bikeList,
    //         totalBikes,
    //         totalPages: Math.ceil(totalBikes / Number(limit)),
    //     });

    //     // const bikeList = await this.UserServices.GetBikeList()
    //     // res.status(OK).json({success:true,bikeList})

    //     } catch (error) {
    //         console.error("Error getting bike list:", error);
    //         return res.status(500).json({ success: false, message: "Failed to get bike Lists" });            
    //     }
    // }
    async GetBikeList(req: Request, res: Response): Promise<void> {
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

            res.status(200).json({
                success: true,
                bikeList: result.bikeList,
                totalBikes: result.totalBikes,
                totalPages: result.totalPages,
            });
        } catch (error) {
            console.error('Error in controller GetBikeList:', error);
            res.status(500).json({ success: false, message: 'Failed to get bike list' });
        }
    }

    async getBikeDeatils(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const bike = await this.UserServices.getbikeDeatils(id)
            if (!bike) return res.status(404).json({ success: false, message: 'Bike not found' });
            res.status(200).json({ success: true, bike })

        } catch (error) {
            console.error("Error getting bike details :", error);
            return res.status(500).json({ success: false, message: "Failed to get bike Deatils" });
        }
    }


}

export default UserController;


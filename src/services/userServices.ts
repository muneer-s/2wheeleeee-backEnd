import { UserInterface } from "../interfaces/IUser";
import UserRepository from "../repositories/userRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { Request } from "express";
import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;



class UserServices {
    constructor(private userRepository: UserRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT,

    ) { }

    async userSignup(userData: UserInterface): Promise<boolean | null> {
        try {
            console.log('new user aano nn checking');
            return await this.userRepository.emailExistCheck(userData.email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }

    }

    async saveUser(userData: any) {
        try {
            console.log("servicil", userData);

            return await this.userRepository.saveUser(userData)
        } catch (error) {
            console.log(error);

        }
    }

    async verifyOtp(data: { otp: number, userId: string }) {
        try {
            // console.log('11111', data);

            let email = data.userId
            let otp = data.otp

            return await this.userRepository.checkOtp(email, otp)

        } catch (error) {
            console.log(error);

        }
    }

    async login(email: string) {
        try {
            return await this.userRepository.login(email)


        } catch (error) {
            console.log(error);

        }
    }

    async getProfile(email: string) {
        try {
            return await this.userRepository.getProfile(email)
        } catch (error) {
            console.log(error);

        }
    }

    async editProfile(email: string, userData: Partial<UserInterface>, req: Request) {
        try {
            let cloudinaryUrl = null;

            if (req.file && req.file.buffer) {
                const result = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "profile_pictures",
                            transformation: [
                                // Optional: add transformations like resizing
                                { width: 500, height: 500, crop: "limit" }
                            ]
                        },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary upload error:", error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    // uploadStream.end(req.file?.buffer);

                    // Ensure buffer is being written
                    if (req.file?.buffer) {
                        uploadStream.end(req.file.buffer);
                    } else {
                        reject(new Error("File buffer is undefined"));
                    }





                });

                 // Store the Cloudinary URL
            cloudinaryUrl = result?.secure_url;

            // Add the Cloudinary URL to userData
            userData.profile_picture = cloudinaryUrl;

            }



            const updatedUser = await this.userRepository.editProfile(email, userData);
            if (!updatedUser) {
                throw new Error("User not found");
            }
            return updatedUser;
        } catch (error) {
            console.error("Service error updating profile:", error);
            throw new Error("Service error updating user profile");
        }
    }


}

export default UserServices;
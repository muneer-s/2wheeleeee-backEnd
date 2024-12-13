import { UserInterface } from "../interfaces/IUser";
import UserRepository from "../repositories/userRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;

// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (file: UploadedFile, folder: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [
                    { width: 500, height: 500, crop: "limit" } // Optional: Add transformations as needed
                ]
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result?.secure_url || "");
                }
            }
        );

         // Ensure buffer is written to the stream
         if (file?.path) {
            const fs = require("fs");
            const stream = fs.createReadStream(file.path);
            stream.pipe(uploadStream); // Use the file's path to create a stream
        } else {
            reject(new Error("File path is undefined"));
        }

        // Ensure buffer is written to the stream
        // if (file?.buffer) {
        //     uploadStream.end(file.buffer);
        // } else {
        //     reject(new Error("File buffer is undefined"));
        // }
    });
};

interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}


class UserServices {
    constructor(private userRepository: UserRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT,

    ) { }

    async userSignup(userData: UserInterface): Promise<boolean | null> {
        try {
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

    async editUserDocuments(req: Request, res: Response) {
        try {
            const frontImage = (req.files as { [fieldname: string]: UploadedFile[] })?.frontImage?.[0];
            const backImage = (req.files as { [fieldname: string]: UploadedFile[] })?.backImage?.[0];
            console.log(11111, frontImage);
            console.log(22222, backImage);

            if (!frontImage || !backImage) {
                return res.status(400).json({ message: "Both frontImage and backImage are required." });
            }

            const userId = req.body.userId;
            const licenseNumber = req.body.license_number;
            const licenseExpDate = req.body.license_Exp_Date;

            console.log("Form data:", { userId, licenseNumber, licenseExpDate });

            // Upload images to Cloudinary
            const frontImageUrl = await uploadToCloudinary(frontImage, "user_documents");
            const backImageUrl = await uploadToCloudinary(backImage, "user_documents");
            console.log('url front : ', frontImageUrl);
            console.log('url back : ', backImageUrl);


            const documentData = {
                license_number: licenseNumber,
                license_Exp_Date: licenseExpDate,
                license_picture_front: frontImageUrl,
                license_picture_back: backImageUrl,
            };

            const result = await this.userRepository.saveUserDocuments(userId, documentData);
            console.log('---------------------',result);
            




        } catch (error) {
            console.log(error);

        }

    }


}

export default UserServices;
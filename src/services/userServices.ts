import { UserInterface } from "../interfaces/IUser";
import UserRepository from "../repositories/userRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
import { generateRandomOTP } from "../utils/otpGenerator";
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUserService } from "../interfaces/user/IUserService";


dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
})



const uploadToCloudinary = async (file: UploadedFile, folder: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [
                    { width: 500, height: 500, crop: "limit" }
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

        if (file?.path) {
            const fs = require("fs");
            const stream = fs.createReadStream(file.path);
            stream.pipe(uploadStream);
        } else {
            reject(new Error("File path is undefined"));
        }


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


class UserServices implements IUserService {
    constructor(private userRepository: IUserRepository) { }

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
            return await this.userRepository.saveUser(userData)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async login(email: string) {
        try {
            return await this.userRepository.login(email)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getProfile(email: string) {
        try {
            return await this.userRepository.getProfile(email)
        } catch (error) {
            console.log(error);
            throw error
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

                    if (req.file?.buffer) {
                        uploadStream.end(req.file.buffer);
                    } else {
                        reject(new Error("File buffer is undefined"));
                    }

                });

                cloudinaryUrl = result?.secure_url;

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

            const userId = req.body.userId;
            const licenseNumber = req.body.license_number;
            const licenseExpDate = req.body.license_Exp_Date;

            const existingUser = await this.userRepository.getUserById(userId);

            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }

            let frontImageUrl = existingUser.license_picture_front;
            let backImageUrl = existingUser.license_picture_back;

            if (frontImage) {
                frontImageUrl = await uploadToCloudinary(frontImage, "user_documents");
            }
            if (backImage) {
                backImageUrl = await uploadToCloudinary(backImage, "user_documents");
            }

            const documentData = {
                license_number: licenseNumber,
                license_Exp_Date: licenseExpDate,
                license_picture_front: frontImageUrl,
                license_picture_back: backImageUrl,
            };

            const result = await this.userRepository.saveUserDocuments(userId, documentData);
            return result


        } catch (error) {
            console.log(error);
            throw error
        }

    }

    async GetBikeList(filters: {
        page: number;
        limit: number;
        search: string;
        fuelType: string;
        minRent: number;
        maxRent: number;
    }) {
        try {
            const { page, limit, search, fuelType, minRent, maxRent } = filters;

            const query: any = { isHost: true };

            if (search) {
                query.$or = [
                    { modelName: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } },
                ];
            }
            if (fuelType) {
                query.fuelType = fuelType;
            }

            if (minRent && maxRent) {
                query.rentAmount = { $gte: minRent, $lte: maxRent };
            }

            const skip = (page - 1) * limit;

            const bikeList = await this.userRepository.getBikeList(query, skip, limit);
            

            const totalBikes = await this.userRepository.countBikes(query);

            return {
                bikeList,
                totalBikes,
                totalPages: Math.ceil(totalBikes / limit),
            };


        } catch (error) {
            console.error("Error in getbikelist service layer:", error);
            throw error;
        }
    }

    async getBikeDetails(id: string) {
        try {
            const result = await this.userRepository.getBikeDetails(id)
            return result

        } catch (error) {
            console.error("Error in getbikedetails service layer:", error);
            throw error;
        }
    }




}

export default UserServices;
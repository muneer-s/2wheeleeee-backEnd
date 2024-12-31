import { BikeData } from "../interfaces/BikeInterface";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
const { OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;
import HostRepository from "../repositories/hostRepository";
import { Readable } from "stream";
import { error } from "console";
import mongoose from "mongoose";


class HostServices {
    constructor(private hostRepository: HostRepository) { }


    async saveBikeDetails(req: Request, res: Response) {
        try {

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };


            const images: Express.Multer.File[] = files?.images || [];
            const rcImage: Express.Multer.File | undefined = files?.rcImage?.[0];
            const insuranceImage: Express.Multer.File | undefined = files?.insuranceImage?.[0];


            console.log("Received Form Data:");
            console.log(req.body);

            console.log("Uploaded Files:");
            console.log("Images: ", images);
            console.log("RC Image: ", rcImage);
            console.log("Insurance Image: ", insuranceImage);


            const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<UploadApiResponse> => {
                return new Promise((resolve, reject) => {
                    const readableStream = new Readable();
                    readableStream.push(buffer);
                    readableStream.push(null); 
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder, resource_type: "image" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result as UploadApiResponse);
                        }
                    );
                    readableStream.pipe(uploadStream);
                });
            };


            const imageUploadPromises = images.map((image) =>
                uploadToCloudinary(image.buffer, "bikes/images")
            );


            const rcImageUploadPromise = rcImage
                ? uploadToCloudinary(rcImage.buffer, "bikes/rc_images")
                : null;

            const insuranceImageUploadPromise = insuranceImage
                ? uploadToCloudinary(insuranceImage.buffer, "bikes/insurance_images")
                : null;




             const uploadedImages = await Promise.all(imageUploadPromises);
            const uploadedRcImage = rcImageUploadPromise
                ? await rcImageUploadPromise
                : null;
            const uploadedInsuranceImage = insuranceImageUploadPromise
                ? await insuranceImageUploadPromise
                : null;

                if (!req.userId) {
                    return res.status(400).json({ message: "User ID is required" });
                }


                const bikeData: BikeData = {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    companyName: req.body.companyName,
                    modelName: req.body.modelName,
                    rentAmount: req.body.rentAmount,
                    fuelType: req.body.fuelType,
                    registerNumber: req.body.registerNumber,
                    insuranceExpDate: req.body.insuranceExpDate,
                    polutionExpDate: req.body.polutionExpDate,
                    images: uploadedImages.map((image) => image.secure_url),
                    rcImage: uploadedRcImage?.secure_url || null,
                    insuranceImage: uploadedInsuranceImage?.secure_url || null,
                };


            console.log('-------------', bikeData);
            const savedBike = await this.hostRepository.saveBikeDetails(bikeData);
            console.log("00000000000",savedBike);
            

            return savedBike
            
        } catch (error) {
            console.error("Error uploading images or saving bike details:", error);
            return res.status(INTERNAL_SERVER_ERROR).json({
                message: "Failed to save bike details",
                error: error,
            });
        }
    }

    async isAdminVerifyUser(userId:string ){
        try {
            const findUser = await this.hostRepository.isAdminVerifyUser(userId);
            return findUser

        } catch (error) {
            console.log(error);
            
        }
    }


    async fetchBikeData(userId:string | undefined){
        try {
            if (!userId) throw new Error("User ID is undefined");

            const bikes = await this.hostRepository.fetchBikeData(userId)
            return bikes
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;            
        }
    }

    async bikeSingleView(bikeId:string){
        try {
            const bike = await this.hostRepository.bikeSingleView(bikeId)
            return bike
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;  
        }
    }

    async deleteBike(bikeId:string){
        try {
            const bike = await this.hostRepository.deleteBike(bikeId)
            return bike
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;  
        }
    }


}

export default HostServices;
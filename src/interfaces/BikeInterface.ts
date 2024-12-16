
import mongoose from "mongoose";

export interface BikeData {
    userId: mongoose.Types.ObjectId;
    companyName: string;
    modelName: string;
    rentAmount: number;
    fuelType: string;
    registerNumber: string;
    insuranceExpDate: Date;
    polutionExpDate: Date;
    images: string[]; // Store array of image URLs
    rcImage: string | null; // Store single RC image URL
    insuranceImage: string | null; // Store single insurance image URL
    isBlocked?: boolean; // Add this field
    isHost?: boolean; // Add this field
}

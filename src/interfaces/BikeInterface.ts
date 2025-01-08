
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
    images: string[]; 
    rcImage: string | null; 
    insuranceImage: string | null; 
    isBlocked?: boolean; 
    isHost?: boolean; 
    isEdit:boolean
}

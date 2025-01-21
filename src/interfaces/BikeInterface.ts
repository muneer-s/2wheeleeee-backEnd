import mongoose,{ Document } from "mongoose";

export interface BikeData  extends Document{
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
    PolutionImage: string | null; 
    insuranceImage: string | null; 
    isBlocked?: boolean; 
    isHost?: boolean; 
    isEdit:boolean
}


export type BikeDataInput = Omit<BikeData, "_id" | "__v" | keyof Document>;

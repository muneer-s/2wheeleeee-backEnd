import mongoose, { Document } from "mongoose";



export interface UserInterface extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    email: string;
    phoneNumber: number;
    isBlocked: boolean;
    isVerified:boolean;
    profile_picture:string;
    dateOfBirth:Date;
    location: string | null;
    lisence_picture_front: string;    
    lisence_picture_back: string;    
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}




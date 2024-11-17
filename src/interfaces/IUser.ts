import mongoose, { ObjectId } from "mongoose";


interface UserInterface {
    id: string;
    name: string;
    password: string;
    email: string;
    phoneNumber: number;
    isBlocked: boolean;
    profile_picture:string;
    dateOfBirth:Date;
    location: string | null;
    lisence_picture: string[]; 
    
}

export default UserInterface;

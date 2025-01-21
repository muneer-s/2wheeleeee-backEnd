import { UserInterface } from "../IUser";
import { Request, Response } from "express";

export interface IUserService {
    userSignup(userData: UserInterface): Promise<boolean | null>;
    saveUser(userData: any): Promise<UserInterface | null>;
    login(email: string): Promise<UserInterface | null>;
    getProfile(email: string): Promise<UserInterface | null>;
    editProfile(email: string, userData: Partial<UserInterface>, req: Request): Promise<UserInterface | null>;
    editUserDocuments(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>> | UserInterface | null>; 
    GetBikeList(filters: {
        page: number;
        limit: number;
        search: string;
        fuelType: string;
        minRent: number;
        maxRent: number;
    }): Promise<{
        bikeList: any[];
        totalBikes: number;
        totalPages: number;
    }>;
    getBikeDetails(id: string): Promise<any | null>;
}

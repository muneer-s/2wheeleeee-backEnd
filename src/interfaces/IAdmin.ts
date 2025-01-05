import AdminRepository from "../repositories/adminRepository";

// interfaces/IAdmin.ts
export interface IAdminRepository {
    getAllUsers(filters: {
        page: number;
        limit: number;
        search: string;
        isBlocked?: string | undefined;
        isUser?: string | undefined;
    }): Promise<{ users: any[]; totalUsers: number; totalPages: number } | undefined>;

    getSingleUser(userId: string): Promise<any | undefined>;

    userVerify(userId: string): Promise<any | string>;

    userBlockUnblock(userId: string): Promise<any | string>;

    getAllBikeDetails(
        query: object,
        options: { skip: number; limit: number; sort: object; search?: string }
    ): Promise<{ bikes: any[]; total: number }>;

    verifyHost(bikeId: string): Promise<any | string>;

    findUserByEmail(email: string): Promise<any | undefined>;
}

export interface IAdminServices {
    getAllUsers(filters: {
        page: number;
        limit: number;
        search: string;
        isBlocked?: string | undefined;
        isUser?: string | undefined;
    }): Promise<any>;

    getSingleUser(userId: string): Promise<any>;

    userVerify(userId: string): Promise<any | string>;

    userBlockUnblock(userId: string): Promise<any | string>;

    getAllBikeDetails(
        query: object,
        options: { skip: number; limit: number; sort: object; search: string }
    ): Promise<any>;

    verifyHost(bikeId: string): Promise<any>;

    findUserByEmail(email: string): Promise<any>;
}













////////////////////////////////////////////////////////////////////////////////////////////
//          AdminRepository





// import { IAdminRepository } from '../interfaces/IAdmin';
// import bikeModel from '../models/bikeModel';
// import userModel from '../models/userModels';
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.TRANSPORTER_EMAIL,
//         pass: process.env.TRANSPORTER_PASS,
//     }
// });

// class AdminRepository implements IAdminRepository {
//     async getAllUsers(filters) { /* Implementation remains the same */ }

//     async getSingleUser(userId) { /* Implementation remains the same */ }

//     async userVerify(userId) { /* Implementation remains the same */ }

//     async userBlockUnblock(userId) { /* Implementation remains the same */ }

//     async getAllBikeDetails(query, options) { /* Implementation remains the same */ }

//     async verifyHost(bikeId) { /* Implementation remains the same */ }

//     async findUserByEmail(email) { /* Implementation remains the same */ }
// }

// export default AdminRepository;






// adminservises


// Ensure AdminServices implements the IAdminServices interface and uses IAdminRepository.




// import { IAdminRepository, IAdminServices } from '../interfaces/IAdmin';

// class AdminServices implements IAdminServices {
//     constructor(private adminRepository: IAdminRepository) {}

//     async getAllUsers(filters) { /* Implementation remains the same */ }

//     async getSingleUser(userId) { /* Implementation remains the same */ }

//     async userVerify(userId) { /* Implementation remains the same */ }

//     async userBlockUnblock(userId) { /* Implementation remains the same */ }

//     async getAllBikeDetails(query, options) { /* Implementation remains the same */ }

//     async verifyHost(bikeId) { /* Implementation remains the same */ }

//     async findUserByEmail(email) { /* Implementation remains the same */ }
// }

// export default AdminServices;

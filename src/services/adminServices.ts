import { UserInterface } from "../interfaces/IUser";

import AdminRepository from "../repositories/adminRepository";

class AdminServices {
    constructor(private adminRepository: AdminRepository) { }

    async getAllUsers(filters: { page: number; limit: number; search: string; isBlocked?: string | undefined; isUser?: string | undefined }) {
        try {
            return await this.adminRepository.getAllUsers(filters)
        } catch (error) {
            console.log(error);
            throw error;

        }
    }

    async getSingleUser(userId: string) {
        try {
            return await this.adminRepository.getSingleUser(userId)

        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async userVerify(userId: string) {
        try {
            return await this.adminRepository.userVerify(userId)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async userBlockUnblock(userId: string) {
        try {
            return await this.adminRepository.userBlockUnblock(userId)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getAllBikeDetails(query: object, options: { skip: number; limit: number; sort: object ,search:string}) {
        try {
            return await this.adminRepository.getAllBikeDetails(query, options)
        } catch (error) {
            console.log(error);
            throw error
        }
    }


    

    async verifyHost(bikeId: string) {
        try {
            return await this.adminRepository.verifyHost(bikeId)

        } catch (error) {
            console.log(error);
            throw error

        }
    }

    async findUserByEmail(email: string) {
        try {
            return await this.adminRepository.findUserByEmail(email)

        } catch (error) {
            console.log(error);
            throw error

        }
    }

    async isEditOn(bikeId:string){
        try {
            return await this.adminRepository.isEditOn(bikeId)
        } catch (error) {
            console.log("error is is edit on : ",error)
            throw error
        }
    }


}

export default AdminServices;
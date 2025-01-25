
import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { UserInterface } from "../interfaces/IUser";
import { IBikeWithUserDetails } from "../interfaces/admin/IAdminRepository";
import { BikeData } from "../interfaces/BikeInterface";

class AdminServices implements IAdminService{
    constructor(private adminRepository: IAdminRepository) { }

    async getAllUsers(filters: { 
        page: number; 
        limit: number; 
        search: string; 
        isBlocked?: string | undefined; 
        isUser?: string | undefined 
    }):Promise<{ users: UserInterface[]; totalUsers: number; totalPages: number } | undefined> {
        try {
            return await this.adminRepository.getAllUsers(filters)
        } catch (error) {
            console.log(error);
            throw error;

        }
    }

    async getSingleUser(userId: string): Promise<UserInterface | null | undefined> {
        try {
            return await this.adminRepository.getSingleUser(userId)

        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async userVerify(userId: string): Promise<UserInterface | string | undefined> {
        try {
            return await this.adminRepository.userVerify(userId)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async userBlockUnblock(userId: string): Promise<UserInterface | { success: boolean; message: string } | undefined> {
        try {
            return await this.adminRepository.userBlockUnblock(userId)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getAllBikeDetails(
        query: object, 
        options: { skip: number; limit: number; sort: object ,search:string}
    ): Promise<{ bikes: IBikeWithUserDetails[]; total: number }> {
        try {
            return await this.adminRepository.getAllBikeDetails(query, options)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async verifyHost(bikeId: string): Promise<BikeData | string | undefined> {
        try {
            return await this.adminRepository.verifyHost(bikeId)

        } catch (error) {
            console.log(error);
            throw error

        }
    }

    async revokeHost(bikeId:string,reason:string): Promise<BikeData | string | undefined>{
        try {
            return await this.adminRepository.revokeHost(bikeId,reason)
            
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findUserByEmail(email: string): Promise<UserInterface | null | undefined> {
        try {
            return await this.adminRepository.findUserByEmail(email)

        } catch (error) {
            console.log(error);
            throw error

        }
    }

    async isEditOn(bikeId:string): Promise<BikeData | undefined>{
        try {
            return await this.adminRepository.isEditOn(bikeId)
        } catch (error) {
            console.log("error is is edit on : ",error)
            throw error
        }
    }


}

export default AdminServices;
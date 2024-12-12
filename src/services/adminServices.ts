import { UserInterface } from "../interfaces/IUser";

import AdminRepository from "../repositories/adminRepository";

class AdminServices {
    constructor(private adminRepository: AdminRepository,
    ) { }

    async getAllUsers() {
        try {
            return await this.adminRepository.getAllUsers()
        } catch (error) {
            console.log(error);

        }
    }

    async getSingleUser(userId:string){
        try {
            return await this.adminRepository.getSingleUser(userId)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    async userVerify(userId:string){
        try {

            return await this.adminRepository.userVerify(userId)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    // async editProfile(email: string, userData: Partial<UserInterface>) {
    //     try {
    //         const updatedUser = await this.userRepository.editProfile(email, userData);
    //         if (!updatedUser) {
    //             throw new Error("User not found");
    //         }
    //         return updatedUser;
    //     } catch (error) {
    //         console.error("Service error updating profile:", error);
    //         throw new Error("Service error updating user profile");
    //     }
    // }


}

export default AdminServices;
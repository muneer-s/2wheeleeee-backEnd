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

    async getSingleUser(userId: string) {
        try {
            return await this.adminRepository.getSingleUser(userId)

        } catch (error) {
            console.log(error);

        }
    }

    async userVerify(userId: string) {
        try {

            return await this.adminRepository.userVerify(userId)

        } catch (error) {
            console.log(error);

        }
    }

    async getAllBikeDetails() {
        try {
            return await this.adminRepository.getAllBikeDetails()
        } catch (error) {
            console.log(error);

        }
    }

    async verifyHost(bikeId: string) {
        try {
            return await this.adminRepository.verifyHost(bikeId)

        } catch (error) {

        }
    }


}

export default AdminServices;
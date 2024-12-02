import { UserInterface } from "../interfaces/IUser";
import UserRepository from "../repositories/userRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";

const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;



class UserServices {
    constructor(private userRepository: UserRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT,
    ) { }

    async userSignup(userData: UserInterface): Promise<boolean | null> {
        try {
            console.log('new user aano nn checking');
            return await this.userRepository.emailExistCheck(userData.email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }

    }

    async saveUser(userData: any) {
        try {
            console.log("servicil", userData);

            return await this.userRepository.saveUser(userData)
        } catch (error) {
            console.log(error);

        }
    }

    async verifyOtp(data: { otp: number, userId: string }) {
        try {
            // console.log('11111', data);

            let email = data.userId
            let otp = data.otp

            return await this.userRepository.checkOtp(email, otp)

        } catch (error) {
            console.log(error);

        }
    }

    async login(email: string) {
        try {
            return await this.userRepository.login(email)


        } catch (error) {
            console.log(error);

        }
    }


}

export default UserServices;
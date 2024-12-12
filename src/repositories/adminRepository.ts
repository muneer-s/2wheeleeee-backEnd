import { UserInterface } from '../interfaces/IUser';
import userModel from '../models/userModels';



class AdminRepository {

    async getAllUsers() {
        try {
            return await userModel.find()
        } catch (error) {
            console.log(error);

        }
    }

    async getSingleUser(userId: string) {
        try {
            return await userModel.findById(userId)

        } catch (error) {
            console.log(error);

        }
    }

    async userVerify(userId: string) {
        try {

            
            const user = await userModel.findById(userId);

            if (!user) {
                return 'User not found'
            }

            user.isUser = !user.isUser;
            await user.save();

            return user 

        } catch (error) {
            console.log(error);

        }
    }

    // async editProfile(email: string, userData: Partial<UserInterface>) {
    //     try {

    //         const updatedUser = await userModel.findOneAndUpdate(
    //             { email },
    //             { $set: userData },
    //             { new: true, runValidators: true }
    //         );
    //         return updatedUser;
    //     } catch (error) {
    //         console.error("Error updating profile:", error);
    //         throw new Error("Error updating user profile");
    //     }
    // }





}

export default AdminRepository;
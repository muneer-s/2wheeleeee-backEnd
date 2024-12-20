import { UserInterface } from '../interfaces/IUser';
import OTPModel from '../models/otpModels';
import userModel from '../models/userModels';
import bcrypt from 'bcrypt';



class UserRepository {

  async emailExistCheck(email: string): Promise<boolean | null> {
    try {
      const userFound = await userModel.findOne({ email: email });

      if (userFound) {
        return true
      } else {
        return false
      }

    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }
  
  async saveUser(userData: any) {
    try {
      const newUser = new userModel(userData);
      await newUser.save();
      return newUser as UserInterface
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async checkOtp(email: string, otp: number) {
    try {
      const otpRecord = await OTPModel.findOne({ email })

      if (!otpRecord) {
        console.log('OTP record not found');
        return false;
      }
      const isMatch = await bcrypt.compare(otp.toString(), otpRecord.hashedOTP);

      if (!isMatch) {
        console.log('Invalid OTP');
        return false;
      }
      await userModel.updateOne({ email }, { $set: { isVerified: true } })
      return true; 


    } catch (error) {
      console.log(error);
      return false
    }
  }

  async login(email: string) {
    try {
      return await userModel.findOne({ email: email, isVerified: true })
    } catch (error) {
      console.log(error);
    }
  }


  async getProfile(email: string) {
    try {
      return await userModel.findOne({ email: email })
    } catch (error) {
      console.log(error);

    }
  }

  async editProfile(email: string, userData: Partial<UserInterface>) {
    try {
      // if (userData.password) {
      //   const salt = await bcrypt.genSalt(10);
      //   userData.password = await bcrypt.hash(userData.password, salt);
      // }

      console.log(11111111111,userData);
      

      const updatedUser = await userModel.findOneAndUpdate(
        { email },
        { $set: userData },
        { new: true, runValidators: true }
      );

      return updatedUser ;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Error updating user profile");
    }
  }

  async saveUserDocuments(userId: string, documentData: Partial<UserInterface>) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            license_number: documentData.license_number,
            license_Exp_Date: documentData.license_Exp_Date,
            license_picture_front: documentData.license_picture_front,
            license_picture_back: documentData.license_picture_back,
          }
        },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.error("Error updating user documents in the repository:", error);
      throw new Error("Failed to update user documents in the database");
    }
  }

  async getUserById(userId: string) {
    return await userModel.findById(userId);
}






}

export default UserRepository;
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
      console.log('fghjkl;', isMatch);

      if (!isMatch) {
        console.log('Invalid OTP');
        return false;
      }
      await userModel.updateOne({ email }, { $set: { isVerified: true } })
      return true; // OTP is valid


    } catch (error) {
      console.log(error);
      return false
    }
  }

  async login(email: string) {
    try {
      return await userModel.findOne({ email: email })
    } catch (error) {
      console.log(error);
    }
  }




}

export default UserRepository;
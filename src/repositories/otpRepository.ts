import OTPModel from '../models/otpModels';
import userModel from '../models/userModels';
import bcrypt from 'bcrypt';
import { IOtpRepository } from '../interfaces/otp/IOtpRepository';

class OtpRepository implements IOtpRepository{

    async saveOtp(email: string, hashedOTP: string) {
        try {
            await OTPModel.findOneAndUpdate(
                { email: email },
                {
                    $set: {
                        hashedOTP,
                        expireAt: new Date(Date.now() + 60 * 1000),
                    },
                },
                { upsert: true, new: true }
            );

            return true
        } catch (error) {
            console.log("Error in otp Repository layer save otp ", error);
            throw error;
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
            console.log("error showing when check otp is correct ", error);
            throw error;
        }
    }

}

export default OtpRepository;
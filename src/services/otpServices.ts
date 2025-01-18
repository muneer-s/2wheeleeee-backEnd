import { generateRandomOTP } from "../utils/otpGenerator";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import { error } from "console";
import { IOtpService } from "../interfaces/otp/IOtpService";
import { IOtpRepository } from "../interfaces/otp/IOtpRepository";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
})

class OtpServices implements IOtpService{
    constructor(private otpRepository: IOtpRepository) { }

    async generateAndSendOtp(email: string) {
        try {
            const otp: string | null = generateRandomOTP()
            const hashedOTP = await bcrypt.hash(otp, 10);
            // console.log("hashedOTP : ",hashedOTP)

            const saveOtp = await this.otpRepository.saveOtp(email, hashedOTP)

            if (!saveOtp) {
                console.log("otp is not saved")
                throw error
            }

            const mailOptions = {
                from: process.env.TRANSPORTER_EMAIL,
                to: email,
                subject: 'OTP Verification',
                text: `Welcome to 2wheleeee. Your OTP for registration is: ${otp}`
            }

            await transporter.sendMail(mailOptions)
            return otp

        } catch (error) {
            console.error("Error generate and send otp service layer:", error);
            throw error;
        }
    }

    

    async verifyOtp(data: { otp: number, userId: string }): Promise<boolean> {
        try {
            let email = data.userId
            let otp = data.otp
            return await this.otpRepository.checkOtp(email, otp)
        } catch (error) {
            console.log(error);
            return false;

        }
    }
    

}

export default OtpServices;
import bikeModel from '../models/bikeModel';
import userModel from '../models/userModels';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
})

class AdminRepository {

    async getAllUsers(filters: { page: number; limit: number; search: string; isBlocked?: string | undefined; isUser?: string | undefined}) {
        try {
            const { page, limit, search, isBlocked, isUser } = filters;
            console.log(1111,filters);
            

            const query: any = {};

            if (isBlocked !== undefined) query.isBlocked = isBlocked;
            if (isUser !== undefined ) query.isUser = isUser;
            if (search) query.name = { $regex: search, $options: 'i' };


            // Pagination and sorting
            const skip = (page - 1) * limit;
            const users = await userModel.find(query).skip(skip).limit(limit);
            const totalUsers = await userModel.countDocuments(query);
            const totalPages = Math.ceil(totalUsers / limit)

            return { users, totalUsers, totalPages }
            // return await userModel.find()
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
            if (!user) return 'User not found'
            user.isUser = !user.isUser;
            await user.save();
            return user

        } catch (error) {
            console.log(error);

        }
    }

    async userBlockUnblock(userId: string) {
        try {
            const findUser = await userModel.findById(userId)

            if (!findUser) {
                return 'User not found'
            }

            findUser.isBlocked = !findUser.isBlocked;

            if (findUser.isBlocked) {
                const mailOptions = {
                    from: process.env.TRANSPORTER_EMAIL,
                    to: findUser?.email,
                    subject: 'Account Blocked by Admin',
                    text: `Your account has been blocked by the admin due to certain activities. Please contact support if you believe this is a mistake.`,
                }

                try {
                    await transporter.sendMail(mailOptions);
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    return { success: false, message: 'Failed to send email notification' };
                }
            }

            await findUser.save();
            return findUser

        } catch (error) {
            console.log(error);

        }
    }





    async getAllBikeDetails() {
        try {
            const result = await bikeModel.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 1,
                        companyName: 1,
                        modelName: 1,
                        rentAmount: 1,
                        fuelType: 1,
                        images: 1,
                        isBlocked: 1,
                        isHost: 1,
                        registerNumber: 1,
                        insuranceExpDate: 1,
                        polutionExpDate: 1,
                        rcImage: 1,
                        insuranceImage: 1,

                        "userDetails._id": 1,
                        "userDetails.name": 1,
                        "userDetails.email": 1,
                        "userDetails.phoneNumber": 1,
                        "userDetails.address": 1,
                        "userDetails.profile_picture": 1
                    }
                }
            ]);

            console.log("Fetched Bike Details: ", result);
            return result;
        } catch (error) {
            console.error("Error fetching bike details with user details:", error);
            throw error;
        }
    }


    async verifyHost(bikeId: string) {
        try {
            const bike = await bikeModel.findById(bikeId);

            if (!bike) return 'User not found'

            bike.isHost = !bike.isHost;
            const user = await userModel.findById(bike.userId)

            if (bike.isHost) {
                const mailOptions = {
                    from: process.env.TRANSPORTER_EMAIL,
                    to: user?.email,
                    subject: 'Approved Mail',
                    text: `Welcome to 2wheleeee. Your Host Service is approved`
                }

                await transporter.sendMail(mailOptions)
            } else {
                const mailOptions = {
                    from: process.env.TRANSPORTER_EMAIL,
                    to: user?.email,
                    subject: 'Revoke Mail',
                    text: `Welcome to 2wheleeee. Your Host Service is Rejected`
                }
                await transporter.sendMail(mailOptions)
            }


            await bike.save();
            return bike

        } catch (error) {
            console.log(error);

        }
    }

    async findUserByEmail(email: string) {
        try {
            const user = await userModel.findOne({ email });
            return user

        } catch (error) {
            console.log(error);

        }
    }






}

export default AdminRepository;
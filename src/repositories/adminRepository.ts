import bikeModel from '../models/bikeModel';
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
            if (!user) return 'User not found'
            user.isUser = !user.isUser;
            await user.save();
            return user 

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
        await bike.save();
        return bike 

    } catch (error) {
        console.log(error);

    }
}
    

   





}

export default AdminRepository;
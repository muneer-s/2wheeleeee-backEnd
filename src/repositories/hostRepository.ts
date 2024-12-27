import { BikeData } from '../interfaces/BikeInterface';
import bikeModel from '../models/bikeModel';
import userModel from '../models/userModels';


class HostRepository {

  async saveBikeDetails(documentData: BikeData) {
    try {

      const newBike = new bikeModel(documentData);
      const savedBike = await newBike.save();

      console.log('Bike details saved successfully:', savedBike);
      return savedBike;

    } catch (error) {
      console.error("Error updating user documents in the repository:", error);
      throw new Error("Failed to update user documents in the database");
    }
  }

  async isAdminVerifyUser(userId: string ) {
    try {
      const user = await userModel.findById(userId)
      return user
    } catch (error) {
      console.log(error);

    }
  }







}

export default HostRepository;
import { BikeData } from '../interfaces/BikeInterface';
import bikeModel from '../models/bikeModel';
import userModel from '../models/userModels';


class HostRepository {

  async saveBikeDetails(documentData: BikeData) {
    try {
      const newBike = new bikeModel(documentData);
      const savedBike = await newBike.save();
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

  async fetchBikeData(userId:string | undefined){
    try {
      if (!userId) throw new Error("User ID is undefined");
      const bikes = await bikeModel.find({ userId });
      return bikes 
    } catch (error) {
      console.error("Error in repository layer:", error);
      throw error;      
    }
  }

  async bikeSingleView(bikeId:string){
    try {

      if (!bikeId) throw new Error("User ID is undefined");
      const bike = await bikeModel.findById(bikeId);
      console.log("Bike kitti: ",bike);
      return bike
    } catch (error) {
      console.error("Error in repository layer:", error);
      throw error;  
    }
  }

  async deleteBike(bikeId:string){
    try {
      
      if (!bikeId) throw new Error("User ID is undefined");

      const result = await bikeModel.deleteOne({ _id: bikeId });

      if (result.deletedCount === 0) {
          throw new Error("Bike not found");
      }

      console.log("Bike deleted:", result);
      return result; // Return result if deletion is successful
      
    } catch (error) {
      console.error("Error in repository layer:", error);
      throw error;  
    }
  }






}

export default HostRepository;
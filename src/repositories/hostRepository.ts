import { BikeData } from '../interfaces/BikeInterface';
import bikeModel from '../models/bikeModel';
import userModel from '../models/userModels';
import IHostRepository from '../interfaces/host/IHostRepository';
import BaseRepository from './baseRepository';
import { UserInterface } from '../interfaces/IUser';

class HostRepository implements IHostRepository{
  private userRepository: BaseRepository<UserInterface>;
    private bikeRepository: BaseRepository<BikeData>;

    constructor() {
        this.userRepository = new BaseRepository(userModel);
        this.bikeRepository = new BaseRepository(bikeModel);
    }

  async saveBikeDetails(documentData: BikeData) {
    try {
      // const newBike = new bikeModel(documentData);
      // const savedBike = await newBike.save();
      // return savedBike;

      return await this.bikeRepository.create(documentData); 


    } catch (error) {
      console.error("Error updating user documents in the repository:", error);
      throw new Error("Failed to update user documents in the database");
    }
  }

  async isAdminVerifyUser(userId: string) {
    try {
      // const user = await userModel.findById(userId)
      const user = await this.userRepository.findById(userId)
      return user
    } catch (error) {
      console.log(error);

    }
  }

  async fetchBikeData(userId: string | undefined) {
    try {
      if (!userId) throw new Error("User ID is undefined");
      // const bikes = await bikeModel.find({ userId });
      const bikes = await this.bikeRepository.find({ userId });
      return bikes
    } catch (error) {
      console.error("Error in repository layer:", error);
      throw error;
    }
  }

  async bikeSingleView(bikeId: string) {
    try {
      if (!bikeId) throw new Error("User ID is undefined");

      // const bike = await bikeModel.findById(bikeId);
      const bike = await this.bikeRepository.findById(bikeId);
      console.log("Bike kitti: ", bike);
      return bike
    } catch (error) {
      console.error("Error in repository layer:", error);
      throw error;
    }
  }

  async deleteBike(bikeId: string) {
    try {

      if (!bikeId) throw new Error("User ID is undefined");

      // const result = await bikeModel.deleteOne({ _id: bikeId });
      const result = await this.bikeRepository.deleteOne({ _id: bikeId });

      if (result.deletedCount === 0) {
        throw new Error("Bike not found");
      }

      return result;

    } catch (error) {
      console.error("Error in repository layer:", error);
      throw error;
    }
  }

  async editBike(insuranceExpDate: Date, polutionExpDate: Date, insuranceImageUrl: string, pollutionImageUrl: string, bikeId: string) {
    try {
      const updatedBike = await bikeModel.findByIdAndUpdate(
        bikeId,
        {
          insuranceExpDate,
          polutionExpDate,
          insuranceImage: insuranceImageUrl || undefined,
          pollutionImage: pollutionImageUrl || undefined,
        },
        { new: true }
      );
      

      if (!updatedBike) {
        throw new Error("Bike not found.");
      }
      return updatedBike;

    } catch (error) {
      console.error("Error in repository layer edit bike:", error);
      throw error;
    }
  }


  
}

export default HostRepository;
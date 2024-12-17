import { BikeData } from '../interfaces/BikeInterface';
import bikeModel from '../models/bikeModel';


class HostRepository {

  async saveBikeDetails( documentData: BikeData) {
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







}

export default HostRepository;
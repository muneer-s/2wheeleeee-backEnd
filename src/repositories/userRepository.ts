import mongoose from 'mongoose';
import { UserInterface } from '../interfaces/IUser';
import bikeModel from '../models/bikeModel';
import userModel from '../models/userModels';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import BaseRepository from './baseRepository';
import { BikeData } from '../interfaces/BikeInterface';
import walletModel, { IWallet } from '../models/walletModel';


class UserRepository implements IUserRepository {

  private userRepository: BaseRepository<UserInterface>;
  private bikeRepository: BaseRepository<BikeData>;
  private hostRepository: BaseRepository<IWallet>

  constructor() {
    this.userRepository = new BaseRepository(userModel);
    this.bikeRepository = new BaseRepository(bikeModel);
    this.hostRepository = new BaseRepository(walletModel)
  }

  async emailExistCheck(email: string): Promise<boolean | null> {
    try {
      const userFound = await this.userRepository.findOne({ email: email });

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

  async saveUser(userData: any): Promise<UserInterface | null> {
    try {
      // const newUser = new userModel(userData);
      // await newUser.save();
      // return newUser as UserInterface
      const newUser = await this.userRepository.create(userData);
      return newUser;
    } catch (error) {
      console.log(error as Error);
      throw error
    }
  }


  async createWallet(): Promise<IWallet> {
    try {
      // const wallet = new walletModel({ balance: 0 });
      // return wallet.save();

      const wallet = await this.hostRepository.create({balance:0})
      return wallet
    } catch (error) {
      console.error("error in creating wallet:", error);
      throw error;
    }
  }

  async login(email: string): Promise<UserInterface | null> {
    try {
      return await this.userRepository.findOne({ email: email, isVerified: true })
    } catch (error) {
      console.log(error);
      throw error
    }
  }


  async getProfile(email: string): Promise<UserInterface | null> {
    try {
      return await this.userRepository.findOne({ email: email })
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async editProfile(email: string, userData: Partial<UserInterface>): Promise<UserInterface | null> {
    try {
      // const updatedUser = await userModel.findOneAndUpdate(
      //   { email },
      //   { $set: userData },
      //   { new: true, runValidators: true }
      // );
      const updatedUser = await this.userRepository.findOneAndUpdate(
        { email }, 
        { $set: userData }, 
        { new: true, runValidators: true } 
      );


      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Error updating user profile");
    }
  }

  async saveUserDocuments(userId: string, documentData: Partial<UserInterface>): Promise<UserInterface | null> {
    try {
      const updatedUser = await this.userRepository.updateById(userId, {
        license_number: documentData.license_number,
        license_Exp_Date: documentData.license_Exp_Date,
        license_picture_front: documentData.license_picture_front,
        license_picture_back: documentData.license_picture_back,
      });

      return updatedUser;
    } catch (error) {
      console.error("Error updating user documents in the repository:", error);
      throw new Error("Failed to update user documents in the database");
    }
  }

  async getUserById(userId: string): Promise<UserInterface | null> {
    return await this.userRepository.findById(userId);
  }

  async getBikeList(query: object, skip: number, limit: number): Promise<BikeData[]> {
    try {
      return await this.bikeRepository.getList(query, skip, limit);
    } catch (error) {
      console.error('Error in repository getBikeList:', error);
      throw error;
    }
  }

  async countBikes(query: object): Promise<number> {
    try {
      return await this.bikeRepository.countDocuments(query);

    } catch (error) {
      console.error('Error in repository countBikes:', error);
      throw error;
    }
  }
  
  async getBikeDetails(id: string): Promise<any | null> {
    try {
      const pipeline = [
        {
          $match: { _id: new mongoose.Types.ObjectId(id) }, 
        },
        {
          $lookup: {
            from: "users", 
            localField: "userId", 
            foreignField: "_id", 
            as: "userDetails", 
          },
        },
        {
          $unwind: "$userDetails", 
        },
      ];
  
      const bikeDetails = await this.bikeRepository.aggregate(pipeline);
  
      if (!bikeDetails || bikeDetails.length === 0) {
        console.log("Bike not found");
        return null;
      }
  
      return bikeDetails[0];
    } catch (error) {
      console.error("Error fetching bike and user details:", error);
      throw error;
    }
  }


}

export default UserRepository;
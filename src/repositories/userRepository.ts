import mongoose from 'mongoose';
import { UserInterface } from '../interfaces/IUser';
import bikeModel from '../models/bikeModel';
import userModel from '../models/userModels';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import BaseRepository from './baseRepository';
import { BikeData } from '../interfaces/BikeInterface';
import walletModel, { IWallet } from '../models/walletModel';
import OrderModel, { IOrder } from '../models/orderModel';
import { error } from 'console';
import ReviewModel, { IReview } from '../models/reviewModel';


class UserRepository implements IUserRepository {

  private userRepository: BaseRepository<UserInterface>;
  private bikeRepository: BaseRepository<BikeData>;
  private hostRepository: BaseRepository<IWallet>;
  private orderRepository: BaseRepository<IOrder>
  private reviewRepository: BaseRepository<IReview>

  constructor() {
    this.userRepository = new BaseRepository(userModel);
    this.bikeRepository = new BaseRepository(bikeModel);
    this.hostRepository = new BaseRepository(walletModel);
    this.orderRepository = new BaseRepository(OrderModel)
    this.reviewRepository = new BaseRepository(ReviewModel)
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
      const newUser = await this.userRepository.create(userData);
      return newUser;
    } catch (error) {
      console.log(error as Error);
      throw error
    }
  }


  async createWallet(): Promise<IWallet> {
    try {


      const wallet = await this.hostRepository.create({ balance: 0 })
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

  async findUserByEmail(email: string): Promise<UserInterface | null | undefined> {
    try {
      const user = await this.userRepository.findOne({ email });
      return user

    } catch (error) {
      console.log(error);
      throw error
    }
  }


  async getOrder(userId: string): Promise<IOrder[]> {
    try {
      const orders = await this.orderRepository.find({ userId })
      if (!orders || orders.length === 0) {
        return [];
      }
      return orders
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findOrder(orderId: string): Promise<IOrder | undefined> {
    try {
      const orderdetails = await this.orderRepository.findById(orderId)
      if (!orderdetails) {
        throw error
      }
      return orderdetails

    } catch (error) {
      console.log("error in admin repository is find order : ", error);
      throw error
    }
  }

  async findBike(bikeId: string): Promise<BikeData> {
    try {
      const bikeDetails = await this.bikeRepository.findById(bikeId)
      if (!bikeDetails) {
        throw error
      }
      return bikeDetails

    } catch (error) {
      console.log("error in admin repository is find bike : ", error);
      throw error
    }
  }

  async findUser(userId: string): Promise<UserInterface> {
    try {
      const userDetails = await this.userRepository.findById(userId)
      if (!userDetails) {
        throw error
      }
      return userDetails
    } catch (error) {
      console.log("error in admin repository is find owner : ", error);
      throw error
    }
  }

  async findOrderAndUpdate(orderId: string): Promise<IOrder | null> {
    try {
      const result = await this.orderRepository.findOneAndUpdate(
        { _id: orderId },
        { status: "Early Return" },
        { new: true }
      );

      if (!result) {
        throw new Error("Error while return early")
      }

      return result
    } catch (error) {
      throw error
    }
  }

  async returnOrder(orderId: string): Promise<IOrder | null> {
    try {
      const result = await this.orderRepository.findOneAndUpdate(
        { _id: orderId },
        { status: "Return" },
        { new: true }
      );

      if (!result) {
        throw new Error("Error while return")
      }

      return result
    } catch (error) {
      throw error
    }
  }


  async submitReview(reviewerId: string, bikeId: string, rating: number, feedback: string): Promise<IReview | null> {
    try {
      const newReview = {
        reviewerId: new mongoose.Types.ObjectId(reviewerId) as any,
        bikeId: new mongoose.Types.ObjectId(bikeId) as any,
        rating,
        feedback,
      };
      return await this.reviewRepository.create(newReview);

    } catch (error) {
      throw error
    }
  }

  async findReviews(bikeId: string): Promise<IReview[] | null> {
    try {
      //return await this.reviewRepository.find
      return await this.reviewRepository.findAndSort({ bikeId }, { createdAt: -1 });

      //await Review.find({ bikeId }).sort({ createdAt: -1 });

    } catch (error) {
      throw error
    }
  }

}

export default UserRepository;
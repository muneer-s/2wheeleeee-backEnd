import { BikeData } from "../BikeInterface";
import { UserInterface } from "../IUser";

export interface IUserRepository {
  emailExistCheck(email: string): Promise<boolean | null>;
  saveUser(userData: any): Promise<UserInterface | null>;
  login(email: string): Promise<UserInterface | null>;
  getProfile(email: string): Promise<UserInterface | null>;
  editProfile(email: string, userData: Partial<UserInterface>): Promise<UserInterface | null>;
  saveUserDocuments(userId: string, documentData: Partial<UserInterface>): Promise<UserInterface | null>;
  getUserById(userId: string): Promise<UserInterface | null>;
  getBikeList(query: object, skip: number, limit: number): Promise<BikeData[]>;
  countBikes(query: object): Promise<number>;
  getBikeDetails(id: string): Promise<any | null>;
}

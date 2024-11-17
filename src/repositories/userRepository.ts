import UserInterface from '../interfaces/IUser';
import userModel from '../models/userModels';


class UserRepository {
  
  async emailExistCheck(email: string): Promise<UserInterface | null> {
    try {
      const userFound = await userModel.findOne({ email: email });
      return userFound as UserInterface;
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }
  async saveUser(userData: UserInterface): Promise<UserInterface | null> {
    try {
      const newUser = new userModel(userData);
      await newUser.save();
      return newUser as UserInterface
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }
 



}

export default UserRepository;
import UserInterface from '../interfaces/IUser';
import userModel from '../models/userModels';


class UserRepository {

  async emailExistCheck(email: string): Promise<string | null> {
    try {
      console.log("reposiry poyi email ullathano cheked",email);
      
      const userFound = await userModel.findOne({ email: email });
      
      if(userFound ){
        return 'user already exist'
      }else{
        return null
      }

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
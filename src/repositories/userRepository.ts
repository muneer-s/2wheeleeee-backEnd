export interface IUserRepository {
    getUserById(id: string): Promise<string>; // Example method
  }
  
  export class UserRepository implements IUserRepository {
    async getUserById(id: string): Promise<string> {
      return `User with ID: ${id}`; // Mock implementation
    }
  }
  
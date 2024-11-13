import { Request, Response } from 'express';
export class UserController {
  constructor(
      
  ) {}

  public getUser = async (req: Request, res: Response) => {
    const user =12 //await this.userService.getUserDetails(req.params.id);
   // res.json({ user });
  };
}

export default UserController;


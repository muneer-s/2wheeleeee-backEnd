import { Request, Response } from "express";
import { UserInterface } from "../IUser";
import { BikeData } from "../BikeInterface";

interface IHostService {
  saveBikeDetails(req: Request, res: Response): Promise<Response | undefined>;
  isAdminVerifyUser(userId: string): Promise<UserInterface | null>;
  fetchBikeData(userId: string | undefined): Promise<BikeData[]>;
  bikeSingleView(bikeId: string): Promise<BikeData | null>;
  deleteBike(bikeId: string): Promise<boolean>;
  editBike(req: Request, res: Response): Promise< Response>;
}

export default IHostService;

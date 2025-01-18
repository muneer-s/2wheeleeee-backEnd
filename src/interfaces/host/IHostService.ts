import { Request, Response } from "express";

interface IHostService {
  saveBikeDetails(req: Request, res: Response): Promise<any>;
  isAdminVerifyUser(userId: string): Promise<any>;
  fetchBikeData(userId: string | undefined): Promise<any>;
  bikeSingleView(bikeId: string): Promise<any>;
  deleteBike(bikeId: string): Promise<any>;
  editBike(req: Request, res: Response): Promise<any>;
}

export default IHostService;

import { BikeData } from "../BikeInterface";

interface IHostRepository {
  saveBikeDetails(documentData: BikeData): Promise<BikeData>;
  isAdminVerifyUser(userId: string): Promise<any>;
  fetchBikeData(userId: string | undefined): Promise<any>;
  bikeSingleView(bikeId: string): Promise<any>;
  deleteBike(bikeId: string): Promise<any>;
  editBike(
    insuranceExpDate: Date,
    polutionExpDate: Date,
    insuranceImageUrl: string,
    pollutionImageUrl: string,
    bikeId: string
  ): Promise<any>;
}

export default IHostRepository;

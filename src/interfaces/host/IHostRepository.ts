import { BikeData, BikeDataInput } from "../BikeInterface";

interface IHostRepository {
  saveBikeDetails(documentData: BikeDataInput): Promise<BikeData>;
  isAdminVerifyUser(userId: string): Promise<any>;
  fetchBikeData(userId: string | undefined): Promise<any>;
  bikeSingleView(bikeId: string): Promise<any>;
  deleteBike(bikeId: string): Promise<any>;
  editBike(
    insuranceExpDate: Date,
    polutionExpDate: Date,
    insuranceImageUrl: string,
    PolutionImageUrl: string,
    bikeId: string
  ): Promise<any>;
}

export default IHostRepository;

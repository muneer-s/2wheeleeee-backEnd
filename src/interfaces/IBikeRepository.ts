import { BikeData } from "./BikeInterface";


// IBikeRepository.ts
export interface IBikeRepository {
    saveBikeDetails(documentData: BikeData): Promise<BikeData>;
    fetchBikeData(userId: string | undefined): Promise<BikeData[]>;
    bikeSingleView(bikeId: string): Promise<BikeData | null>;
    deleteBike(bikeId: string): Promise<any>;
    editBike(insuranceExpDate: Date, polutionExpDate: Date, insuranceImageUrl: string, pollutionImageUrl: string, bikeId: string): Promise<BikeData | null>;
  }
  
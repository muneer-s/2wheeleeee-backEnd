import BaseRepository from './baseRepository';
import { IOfferRepository } from '../interfaces/offer/IOfferRepository';
import OfferModel, { IOffer } from '../models/offerModel';
import { BikeData } from '../interfaces/BikeInterface';
import bikeModel from '../models/bikeModel';

class offerRepository implements IOfferRepository {

    private offerRepository: BaseRepository<IOffer>
    private bikeRepository: BaseRepository<BikeData>

    constructor() {
        this.offerRepository = new BaseRepository(OfferModel);
        this.bikeRepository = new BaseRepository(bikeModel)
    }

    async saveOffer(newOffer: IOffer): Promise<IOffer> {
        try {
            return await this.offerRepository.create(newOffer)
        } catch (error) {
            throw error
        }
    }

    async viewOffer(userId: string): Promise<IOffer[]> {
        try {
            return await this.offerRepository.find({ offerBy: userId })
        } catch (error) {
            throw error
        }
    }

    async deleteOffer(offerId: string): Promise<IOffer> {
        try {
            return await this.offerRepository.findByIdAndDelete(offerId)
        } catch (error) {
            throw error
        }
    }

    async updateOffer(offerId: string, updatedData: Partial<IOffer>): Promise<IOffer | null> {
        try {
            return await this.offerRepository.updateById(offerId, updatedData);
        } catch (error) {
            throw error
        }
    }

    async findBike(bikeId: string): Promise<BikeData | null> {
        try {
            return await this.bikeRepository.findById(bikeId)

        } catch (error) {
            throw error
        }
    }

    async findOffer(offerId: string): Promise<IOffer | null> {
        try {
            return await this.offerRepository.findById(offerId)
        } catch (error) {
            throw error
        }
    }


    async updateBike(bikeId: string, updateData: Partial<BikeData>): Promise<BikeData | null> {
        try {
            return await this.bikeRepository.updateById(bikeId, updateData);
        } catch (error) {
            console.error("Error updating bike:", error);
            throw new Error("Failed to update bike");
        }
    }


}

export default offerRepository;
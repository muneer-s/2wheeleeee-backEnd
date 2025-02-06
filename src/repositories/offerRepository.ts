import BaseRepository from './baseRepository';
import { IOfferRepository } from '../interfaces/offer/IOfferRepository';
import OfferModel, { IOffer } from '../models/offerModel';

class offerRepository implements IOfferRepository {

    
    private offerRepository: BaseRepository<IOffer>

    constructor() {
        this.offerRepository = new BaseRepository(OfferModel);
    }

   async saveOffer(newOffer: IOffer): Promise<IOffer> {
       try {
        return await this.offerRepository.create(newOffer)
       } catch (error) {
        throw error
       }
   }

   async viewOffer(userId:string): Promise<IOffer[]> {
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

}

export default offerRepository;
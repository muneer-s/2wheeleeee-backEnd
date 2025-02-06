import { IOfferService } from "../interfaces/offer/IOfferService";
import { IOfferRepository } from "../interfaces/offer/IOfferRepository";
import { IOffer } from "../models/offerModel";



class offerServices implements IOfferService {
    constructor(private offerRepository: IOfferRepository) { }

   async saveOffer(newOffer: IOffer): Promise<IOffer> {
       try {
        const save = await this.offerRepository.saveOffer(newOffer)
        return save
       } catch (error) {
        throw error
       }
   }

   async viewOffer(userId:string): Promise<IOffer[]> {
       try {
        return await this.offerRepository.viewOffer(userId)
       } catch (error) {
        throw error
       }
   }

   async deleteOffer(offerId: string): Promise<IOffer> {
       try {
        return await this.offerRepository.deleteOffer(offerId)
       } catch (error) {
        throw error
       }
   }

   async updateOffer(offerId: string, updatedData: Partial<IOffer>): Promise<IOffer | null> {
       try {
        return this.offerRepository.updateOffer(offerId, updatedData);
       } catch (error) {
        throw error
       }
   }

   

}

export default offerServices;
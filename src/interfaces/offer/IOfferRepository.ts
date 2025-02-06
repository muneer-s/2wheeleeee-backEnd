import { IOffer } from "../../models/offerModel";

export interface IOfferRepository {
    saveOffer(newOffer:IOffer):Promise<IOffer>
    viewOffer(userId:string):Promise<IOffer[]>
    deleteOffer(offerId:string):Promise<IOffer>
    updateOffer(offerId: string, updatedData: Partial<IOffer>): Promise<IOffer | null>;


}

import BaseRepository from './baseRepository';
import { IFeedbackRepository } from '../interfaces/feedback/IFeedbackRepository';
import FeedbackModel, { IFeedback } from '../models/feedback';

class feedbackRepository implements IFeedbackRepository {
  
    private feedbackRepository: BaseRepository<IFeedback>;

    constructor() {
        this.feedbackRepository = new BaseRepository(FeedbackModel);
    }

    async createFeedback(data: IFeedback): Promise<IFeedback> {
        try {
            return await this.feedbackRepository.create(data)

        } catch (error) {
            throw error
        }
    }

    async submittedAlready(userId: string): Promise<IFeedback | null> {
        try {
            return await this.feedbackRepository.findOne({userId:userId})
        } catch (error) {
            throw error
        }
    }
    
    // async getWallet(walletId:string):Promise<IWallet>{
    //     try {
    //         const result = await this.walletRepository.findById(walletId)
    //         if (!result) {
    //             throw new Error("Wallet not found");
    //         }

    //         result.history = result.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    //         return result 
    //     } catch (error) {
    //         console.log("error in repository layer of get wallet",error)
    //         throw error
    //     }
    // }


}

export default feedbackRepository;
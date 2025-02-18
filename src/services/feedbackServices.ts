import { IFeedbackServices } from "../interfaces/feedback/IFeedbackServices";
import { IFeedbackRepository } from "../interfaces/feedback/IFeedbackRepository";
import { IFeedback } from "../models/feedback";


class feedbackServices implements IFeedbackServices {

    constructor(private feedbackRepository: IFeedbackRepository) { }

    async createFeedback(data: IFeedback): Promise<IFeedback> {
        try {
            return await this.feedbackRepository.createFeedback(data)
        } catch (error) {
            throw error
        }
    }

    async submittedAlready(userId: string): Promise<IFeedback | null > {
        try {
            return await this.feedbackRepository.submittedAlready(userId)
        } catch (error) {
            throw error
        }
    }

    // async getWallet(walletId: string): Promise<IWallet> {
    //     try {
    //         const result = await this.walletRepository.getWallet(walletId)
    //         return result
    //     } catch (error) {
    //         console.log(error)
    //         throw error
    //     }
    // }

    // async saveWallet(walletId: string, newBalance:number,total:number, bikeId: string) {
    //     try {
    //         const historyEntry = {
    //             date: new Date(),
    //             type: "debit",
    //             amount: total,
    //             reason: bikeId
    //         };

    //         return await this.walletRepository.updateWalletBalance(walletId, newBalance, historyEntry);
    //     } catch (error) {
    //         console.error("Error in WalletServices - saveWallet:", error);
    //         throw error;
    //     }
    // }
}

export default feedbackServices;
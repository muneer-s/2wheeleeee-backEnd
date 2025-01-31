import { IWalletService } from "../interfaces/wallet/IWalletService";
import { IWalletRepository } from "../interfaces/wallet/IWalletRepository";
import { IWallet } from "../models/walletModel";


class walletServices implements IWalletService {
    constructor(private walletRepository: IWalletRepository) { }

async getWallet(walletId:string):Promise<IWallet>{
    try {
        const result = await this.walletRepository.getWallet(walletId)
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}
}

export default walletServices;
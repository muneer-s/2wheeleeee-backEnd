import BaseRepository from './baseRepository';
import { IWalletRepository} from '../interfaces/wallet/IWalletRepository';
import walletModel, { IWallet } from '../models/walletModel';

class walletRepository implements IWalletRepository {
  
    private walletRepository: BaseRepository<IWallet>;

    constructor() {
        this.walletRepository = new BaseRepository(walletModel);
    }
    
    async getWallet(walletId:string):Promise<IWallet>{
        try {
            const result = await this.walletRepository.findById(walletId)
            if (!result) {
                throw new Error("Wallet not found");
            }
            return result
            
        } catch (error) {
            console.log("error in repository layer of get wallet",error)
            throw error
        }
    }



}

export default walletRepository;
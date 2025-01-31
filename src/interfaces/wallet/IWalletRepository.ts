import { IWallet } from "../../models/walletModel";

export interface IWalletRepository{
    getWallet(walletId:string):Promise<IWallet>;

}

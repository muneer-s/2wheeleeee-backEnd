import { IWallet } from "../../models/walletModel";

export interface IWalletService{
    getWallet(walletId:string):Promise<IWallet>;
}

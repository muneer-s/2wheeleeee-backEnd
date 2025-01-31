import {ObjectId} from 'mongodb'
import mongoose, {Document,Schema} from 'mongoose'

export interface IWallet extends Document{
    _id:ObjectId,
    balance:number,

}


const walletSchema:Schema<IWallet> = new Schema({
    balance:{
        type:Number,
        default:0
    },
    
})


const walletModel = mongoose.model<IWallet>('Wallet',walletSchema)
export default walletModel
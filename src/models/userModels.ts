

//-------------------------------------------------------
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types/types';

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IUserDocument>('User', userSchema);
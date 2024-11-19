import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcrypt';
import { UserInterface } from "../interfaces/IUser";







const userSchema: Schema<UserInterface> = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    phoneNumber: {
        type: Number,
        
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified:{
        type: Boolean,
        default:false
    }, 
    profile_picture: {
        type: String,
        default:''
    },
    dateOfBirth: {
        type: Date,

    },
    location: {
        type: String,
        default : '',
    },
    lisence_picture_front: {
        type:String,
        default:''
    },
    lisence_picture_back:{
        type:String,
        default:''
    }
   
});

userSchema.pre('save', async function (this: UserInterface, next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

userSchema.methods.matchPassword = async function (this: UserInterface, enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<UserInterface> = mongoose.model<UserInterface>('User', userSchema);
export default userModel;
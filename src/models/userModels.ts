import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcrypt';


export interface UserInterface extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    email: string;
    phoneNumber: number;
    isBlocked: boolean;
    profile_picture:string;
    dateOfBirth:Date;
    location: string | null;
    lisence_picture: string[];    
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}



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
        required:true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
   
    
    profile_picture: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required:true
    },
    lisence_picture: {
        type: [String], // Array of strings to store front and back pictures
        validate: {
            validator: function (value: string[]) {
                return value.length === 2; // Ensures exactly two pictures
            },
            message: "lisence_picture must contain exactly two entries (front and back)."
        }
    },
   
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
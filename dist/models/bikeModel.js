"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bikeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required: true,
    },
    rentAmount: {
        type: Number,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isHost: {
        type: Boolean,
        default: false
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    registerNumber: {
        type: String,
        required: true
    },
    insuranceExpDate: {
        type: Date,
        required: true
    },
    polutionExpDate: {
        type: Date,
        required: true
    },
    rcImage: {
        type: String,
        required: true,
        default: ''
    },
    PolutionImage: {
        type: String,
        required: true,
        default: ''
    },
    insuranceImage: {
        type: String,
        required: true,
        default: ''
    },
    offer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Offer",
    },
    offerApplied: {
        type: Boolean,
        default: false,
    },
    offerPrice: {
        type: Number,
    },
    location: {
        type: String,
        required: true
    }
}, { timestamps: true });
const bikeModel = mongoose_1.default.model('Bike', bikeSchema);
exports.default = bikeModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const crypto_1 = __importDefault(require("crypto"));
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || crypto_1.default.randomBytes(32).toString('hex'),
    accessTokenExpiry: '15m', // 15 minutes
    refreshTokenExpiry: '7d', // 7 days
};

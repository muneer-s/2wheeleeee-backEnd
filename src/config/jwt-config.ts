import crypto from 'crypto';



export const jwtConfig = {
    secret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
    accessTokenExpiry: '15m',  // 15 minutes
    refreshTokenExpiry: '7d',  // 7 days
};
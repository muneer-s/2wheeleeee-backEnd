import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 2000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/your-db',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: '24h'
};
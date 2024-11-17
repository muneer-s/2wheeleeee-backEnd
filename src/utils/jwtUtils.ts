import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt-config';

export interface TokenPayload {
    userId: string;
    email: string;
}

export class JWTUtils {
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, jwtConfig.secret, {
            expiresIn: jwtConfig.accessTokenExpiry
        });
    }

    static generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, jwtConfig.secret, {
            expiresIn: jwtConfig.refreshTokenExpiry
        });
    }

    static verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, jwtConfig.secret) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

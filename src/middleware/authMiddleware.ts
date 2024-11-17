import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwtUtils';

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Check for token in various places
        const token = req.cookies.accessToken || 
                     req.headers.authorization?.split(' ')[1] ||
                     req.body.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = JWTUtils.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
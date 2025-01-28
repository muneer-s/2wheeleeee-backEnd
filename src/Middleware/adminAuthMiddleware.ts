import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';

dotenv.config();

const jwtHandler = new CreateJWT();

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = req.cookies.admin_access_token;
    let refreshToken = req.cookies.admin_refresh_token;

    console.log("admin aces token  : ", token);
    console.log("admin refresh  : ", refreshToken);


    if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Admin Token expired or not available' });
        return
    }

    if (!token) {
        try {
            const newAccessToken = await refreshAdminAccessToken(refreshToken);
            const accessTokenExpiresIn = 30 * 60 * 1000; // 30 minutes

            res.cookie('admin_access_token', newAccessToken, {
                maxAge: accessTokenExpiresIn,
                httpOnly: true,
                sameSite: 'strict',
            });

            token = newAccessToken;
        } catch (error) {
            res.status(401).json({ success: false, message: 'Failed to refresh token' });
            return
        }
    }

    try {
        const decoded = jwtHandler.verifyToken(token);

        if (decoded?.success && decoded.decoded?.data === process.env.ADMIN_EMAIL) {
            next(); // Proceed to the next middleware or route handler
        } else {
            res.status(401).json({ success: false, message: 'Invalid token' });
            return
        }
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ success: false, message: 'Token expired' });
            return
        } else {
            res.status(401).json({ success: false, message: 'Token verification failed' });
            return
        }
    }
};

// Helper function to refresh access token using the refresh token
const refreshAdminAccessToken = async (refreshToken: string): Promise<string> => {
    if (!refreshToken) {
        throw new Error('No refresh token found');
    }

    try {
        const decoded = jwtHandler.verifyRefreshToken(refreshToken);

        if (!decoded?.decoded?.data || decoded.decoded.data !== process.env.ADMIN_EMAIL) {
            throw new Error('Invalid or missing decoded data');
        }

        const newAccessToken = jwtHandler.generateToken(decoded.decoded.data);

        if (!newAccessToken) {
            throw new Error('Failed to generate new access token');
        }

        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing admin access token:', error);
        throw new Error('Invalid refresh token');
    }
};

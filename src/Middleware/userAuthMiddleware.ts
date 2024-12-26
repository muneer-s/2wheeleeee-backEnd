import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';
import UserRepository from '../repositories/userRepository';
import { STATUS_CODES } from '../constants/httpStatusCodes';

import { UserInterface } from '../interfaces/IUser';
import { decode } from 'punycode';

const { UNAUTHORIZED } = STATUS_CODES

const jwt = new CreateJWT();
const userRepository = new UserRepository();
dotenv.config()


// This ensures that req.userId and req.user are recognized by TypeScript in other parts of the app.
declare global {    // Global Type Declaration
    namespace Express {     // Extends the Request object in Express to include:
        interface Request {
            userId?: string,      // userId (a string representing the authenticated user’s ID).
            user?: UserInterface | null,    // user (an object of type UserInterface representing the user data or null if not available).
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = req.cookies.user_access_token;
    let refresh_token = req.cookies.user_refresh_token;


    // If the refresh_token is not found, the response indicates that the token is expired or unavailable.
    if (!refresh_token) {
        res.json({ success: false, message: 'Token expired or not available' });
        return
    }


    // If the access token is missing, it attempts to generate a new one using the refreshAccessToken function.
    // A new access token is sent back to the client in a cookie with a lifespan of 30 minutes
    if (!token) {
        try {
            const newAccessToken = await refreshAccessToken(refresh_token);
            console.log("token illa so new acess token undakki, ",newAccessToken);
            
            const accessTokenMaxAge = 30 * 60 * 1000;
            res.cookie('user_access_token', newAccessToken, {
                maxAge: accessTokenMaxAge,
                sameSite: 'none',
                secure: true
            });
            token = newAccessToken;

        } catch (error) {
            res.status(401).json({ success: false, message: 'Failed to refresh token' });
            return; 
        }
    }

    try {
        if(!token){
            token = req.cookies.user_access_token;
        }
        
        const decoded = jwt.verifyToken(token);
        console.log("token undel : ", decoded);

        if (decoded?.success) {
            let user = await userRepository.getUserById(decoded.decoded?.data?.toString());
            console.log("user :",user);
            

            if (user?.isBlocked) {
                res.json({ success: false, message: "User is blocked by admin!" })
                return
            } else {
                req.userId = decoded.decoded?.data?.toString();
                req.user = user;
                next();
            }
        } else {
            res.json({ success: false, message: decoded?.message })
        }

    } catch (err: any) {
        console.log('the error is here.');
        console.log(err);
        res.send({ success: false, message: "Authentication failed!" });
        return
    }
}

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
    if (!refreshToken) {
        throw new Error('No refresh token found');
    }
    try {
        const decoded = jwt.verifyRefreshToken(refreshToken);
        console.log("refresh token valid aano :?", decode);
        if (!decoded?.decoded?.data) {
            throw new Error('Decoded data is invalid or missing');
        }

        const newAccessToken = jwt.generateToken(decoded?.decoded.data);
        if (!newAccessToken) {
            throw new Error('Failed to generate new access token');
        }
        return newAccessToken;
    } catch (error) {
        console.log(error);
        throw new Error('Invalid refresh token');
    }
};

export default userAuth;
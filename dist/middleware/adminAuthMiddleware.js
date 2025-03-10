"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const generateToken_1 = require("../utils/generateToken");
dotenv_1.default.config();
const jwtHandler = new generateToken_1.CreateJWT();
const adminAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = req.cookies.admin_access_token;
    let refreshToken = req.cookies.admin_refresh_token;
    if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Admin Token expired or not available' });
        return;
    }
    if (!token) {
        try {
            const newAccessToken = yield refreshAdminAccessToken(refreshToken);
            //const accessTokenExpiresIn = 30 * 60 * 1000;
            res.cookie('admin_access_token', newAccessToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production' ? true : false,
                domain: '.2wheleeee.store'
            });
            token = newAccessToken;
        }
        catch (error) {
            res.status(401).json({ success: false, message: 'Failed to refresh token' });
            return;
        }
    }
    try {
        const decoded = jwtHandler.verifyToken(token);
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.success) && ((_a = decoded.decoded) === null || _a === void 0 ? void 0 : _a.data) === process.env.ADMIN_EMAIL) {
            next(); // Proceed to the next middleware or route handler
        }
        else {
            const newAccessToken = yield refreshAdminAccessToken(refreshToken);
            //const accessTokenExpiresIn = 30 * 60 * 1000;
            res.cookie('admin_access_token', newAccessToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production' ? true : false,
                domain: '.2wheleeee.store'
            });
            token = newAccessToken;
            // res.status(401).json({ success: false, message: 'Invalid token' });
            // return
        }
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ success: false, message: 'Token expired' });
            return;
        }
        else {
            res.status(401).json({ success: false, message: 'Token verification failed' });
            return;
        }
    }
});
exports.adminAuthMiddleware = adminAuthMiddleware;
// Helper function to refresh access token using the refresh token
const refreshAdminAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!refreshToken) {
        throw new Error('No refresh token found');
    }
    try {
        const decoded = jwtHandler.verifyRefreshToken(refreshToken);
        if (!((_a = decoded === null || decoded === void 0 ? void 0 : decoded.decoded) === null || _a === void 0 ? void 0 : _a.data) || decoded.decoded.data !== process.env.ADMIN_EMAIL) {
            throw new Error('Invalid or missing decoded data');
        }
        const newAccessToken = jwtHandler.generateToken(decoded.decoded.data);
        if (!newAccessToken) {
            throw new Error('Failed to generate new access token');
        }
        return newAccessToken;
    }
    catch (error) {
        console.error('Error refreshing admin access token:', error);
        throw new Error('Invalid refresh token');
    }
});

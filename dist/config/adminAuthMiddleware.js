"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuthMiddleware = (req, res, next) => {
    const token = req.cookies.admin_access_token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Token verification failed' });
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;

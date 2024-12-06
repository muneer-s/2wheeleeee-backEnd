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
exports.AdminController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const dotenv_1 = __importDefault(require("dotenv"));
const generateToken_1 = require("../utils/generateToken");
dotenv_1.default.config();
const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = httpStatusCodes_1.STATUS_CODES;
const jwtHandler = new generateToken_1.CreateJWT();
class AdminController {
    constructor() {
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('admin login controlleril ethi', req.body);
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(UNAUTHORIZED).json({ success: false, message: 'Email and password are required' });
                }
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;
                console.log('em:', adminEmail);
                console.log('em:', adminPassword);
                if (email !== adminEmail || password !== adminPassword) {
                    console.log('same alla');
                    return res.status(UNAUTHORIZED).json({ success: false, message: 'Invalid email or password' });
                }
                const time = this.milliseconds(23, 30, 0);
                const token = jwtHandler.generateToken(adminEmail);
                const refreshToken = jwtHandler.generateRefreshToken(adminEmail);
                res.status(OK).cookie('admin_access_token', token, {
                    expires: new Date(Date.now() + time),
                    sameSite: 'strict',
                }).json({
                    success: true,
                    message: 'Login successful',
                    adminEmail: adminEmail,
                    token,
                    refreshToken
                });
            }
            catch (error) {
                console.error('Admin login error:', error);
                return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error', });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('admin_access_token', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(OK).json({ success: true, message: 'Logged out successfully' });
            }
            catch (error) {
                console.error('Admin logout error:', error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.AdminController = AdminController;
exports.default = AdminController;

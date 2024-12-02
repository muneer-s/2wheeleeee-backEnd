import { Request, Response } from 'express';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';
import { time } from 'console';


dotenv.config();

const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = STATUS_CODES;
const jwtHandler = new CreateJWT()

export class AdminController {

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    
    async login(req: Request, res: Response) {
        try {
            console.log('admin login controlleril ethi',req.body);
            
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'Email and password are required' });
            }

            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;
            console.log('em:',adminEmail);
            console.log('em:',adminPassword);
            

            if (email !== adminEmail || password !== adminPassword) {
                console.log('same alla');
                
                return res.status(UNAUTHORIZED).json({ success: false, message: 'Invalid email or password' });
            }
            console.log('pinne no work');
            
            const time = this.milliseconds(23, 30, 0);

            const token = jwtHandler.generateToken(adminEmail);
            const refreshToken = jwtHandler.generateRefreshToken(adminEmail);
            console.log('sameSite value:', 'none');

            res.status(OK).cookie('admin_access_token', token, {
                expires: new Date(Date.now() + time),
                sameSite: 'strict', 
                //secure: true
            }).json({
                success: true,
                message: 'Login successful',
                adminEmail: adminEmail,
                token,
                refreshToken
            });
        } catch (error) {
            console.error('Admin login error:', error);
            return res.status(INTERNAL_SERVER_ERROR).json({success: false,message: 'Internal server error',});
        }
    }

    async logout(req: Request, res: Response) {
        try {     
            res.cookie('admin_access_token', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(OK).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            console.error('Admin logout error:', error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }
}

export default AdminController;

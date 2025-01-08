import { Request, Response } from 'express';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';
import AdminServices from '../services/adminServices';

dotenv.config();

const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = STATUS_CODES;
const jwtHandler = new CreateJWT()

export class AdminController {

    constructor(private AdminServices: AdminServices) {

    }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);


    async login(req: Request, res: Response) {
        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'Email and password are required' });
            }

            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;

            if (email !== adminEmail || password !== adminPassword) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'Invalid email or password' });
            }

            const time = this.milliseconds(0, 30, 0);
            // const time = 30 * 60 * 1000;
            const refreshTokenExpires = 48 * 60 * 60 * 1000; 

            const token = jwtHandler.generateToken(adminEmail);
            const refreshToken = jwtHandler.generateRefreshToken(adminEmail);

            res.status(OK)
                .cookie('admin_access_token', token, {
                    expires: new Date(Date.now() + time),
                    httpOnly: true,
                    sameSite: 'strict',
                }).cookie('admin_refresh_token', refreshToken, {
                    expires: new Date(Date.now() + refreshTokenExpires),
                    httpOnly: true,
                    sameSite: 'strict',
                }).json({
                    success: true,
                    message: 'Login successful',
                    adminEmail: adminEmail,
                    token,
                    refreshToken
                });
        } catch (error) {
            console.error('Admin login error:', error);
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error', });
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

    async getAllUsers(req: Request, res: Response) {
        try {

            const { page = 1, limit = 10, search = '', isBlocked, isUser } = req.query;


            const findUsers = await this.AdminServices.getAllUsers({
                page: Number(page),
                limit: Number(limit),
                search: String(search),
                isBlocked: isBlocked ? String(isBlocked) : undefined,
                isUser: isUser ? String(isUser) : undefined
            });

            res.status(200).json({
                success: true,
                usersList: findUsers?.users,
                totalUsers: findUsers?.totalUsers,
                totalPages: findUsers?.totalPages,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });

        }
    }

    async getSingleUser(req: Request, res: Response) {
        try {

            const userId = req.params.id;
            const user = await this.AdminServices.getSingleUser(userId);
            res.status(200).json({ success: true, user });

        } catch (error) {
            console.log(error);

        }
    }

    async userVerify(req: Request, res: Response) {
        try {
            const userId = req.params.id
            const user = await this.AdminServices.userVerify(userId)
            res.status(200).json({ success: true, user });


        } catch (error) {
            console.log();

        }
    }

    async userBlockUnBlock(req: Request, res: Response) {
        try {
            const userId = req.params.id
            const user = await this.AdminServices.userBlockUnblock(userId)
            res.status(200).json({ success: true, user })

        } catch (error) {
            console.log(error);

        }
    }

    async checkBlockedStatus(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await this.AdminServices.findUserByEmail(email)

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.status(200).json({ success: true, isBlocked: user.isBlocked });
        } catch (error) {
            console.error('Error checking user status:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getAllBikeDetails(req: Request, res: Response) {
        try {

            const { page = 1, limit = 10, search = '', filter = '', sort = '' } = req.query as {
                page?: string;
                limit?: string;
                search?: string;
                filter?: string;
                sort?: string;
            }

            const query = {
                ...(filter && { isHost: filter === 'verified' }),
            };

            const options = {
                skip: (Number(page) - 1) * Number(limit),
                limit: Number(limit),
                sort: sort === 'asc' ? { rentAmount: 1 } : sort === 'desc' ? { rentAmount: -1 } : {},
                search
            };
           
            

            let bikeDetails = await this.AdminServices.getAllBikeDetails(query, options)
            res.status(OK).json({ success: true, bikeDetails })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });

        }
    }


    async verifyHost(req: Request, res: Response) {
        try {
            const bikeId = req.params.id
            const bike = await this.AdminServices.verifyHost(bikeId)
            res.status(200).json({ success: true, bike });

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });

        }
    }

    async isEditOn(req:Request,res:Response){
        try {

            const bikeId = req.params.id
            console.log("nikeid   ;   ",bikeId);
            const bike = await this.AdminServices.isEditOn(bikeId)
            res.status(OK).json({success:true,bike})
            
            
        } catch (error) {
            console.log("error is from is edit on ",error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }













}

export default AdminController;

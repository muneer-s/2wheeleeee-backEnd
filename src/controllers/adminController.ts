import { Request, Response } from 'express';
import { STATUS_CODES } from '../constants/httpStatusCodes';
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';
import AdminServices from '../services/adminServices';
import { IAdminService } from '../interfaces/admin/IAdminService';
import { ResponseModel } from '../utils/responseModel';

dotenv.config();

const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR,NOT_FOUND } = STATUS_CODES;
const jwtHandler = new CreateJWT()

export class AdminController {

    constructor(private AdminServices: IAdminService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);


    async login(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(UNAUTHORIZED).json(ResponseModel.error('Email and password are required'));
            }

            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;

            if (email !== adminEmail || password !== adminPassword) {
                return res.status(UNAUTHORIZED).json(ResponseModel.error('Invalid email or password'))
            }

            const time = this.milliseconds(0, 30, 0);
            const refreshTokenExpires = 48 * 60 * 60 * 1000;

            const token = jwtHandler.generateToken(adminEmail);
            const refreshToken = jwtHandler.generateRefreshToken(adminEmail);

            return res.status(OK)
                .cookie('admin_access_token', token, {
                    expires: new Date(Date.now() + time),
                    httpOnly: true,
                    sameSite: 'strict',
                }).cookie('admin_refresh_token', refreshToken, {
                    expires: new Date(Date.now() + refreshTokenExpires),
                    httpOnly: true,
                    sameSite: 'strict',
                }).json(ResponseModel.success('Login successful', {
                    adminEmail: adminEmail,
                    token,
                    refreshToken
                }))

        } catch (error) {
            console.error('Admin login error:', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error'));
        }
    }

    async logout(req: Request, res: Response): Promise<Response | void> {
        try {
            res.cookie('admin_access_token', '', {
                httpOnly: true,
                expires: new Date(0)
            }).cookie('admin_refresh_token', '', {
                httpOnly: true,
                expires: new Date(0)
            })

            return res.status(OK).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            console.error('Admin logout error:', error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<Response | void> {
        try {

            const { page = 1, limit = 10, search = '', isBlocked, isUser } = req.query;

            const findUsers = await this.AdminServices.getAllUsers({
                page: Number(page),
                limit: Number(limit),
                search: String(search),
                isBlocked: isBlocked ? String(isBlocked) : undefined,
                isUser: isUser ? String(isUser) : undefined
            });

            return res.status(OK).json(ResponseModel.success('All Users List', {
                usersList: findUsers?.users,
                totalUsers: findUsers?.totalUsers,
                totalPages: findUsers?.totalPages,
            }))
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal Server Error', error as Error));
        }
    }

    async getSingleUser(req: Request, res: Response): Promise<Response | void> {
        try {

            const userId = req.params.id;
            const user = await this.AdminServices.getSingleUser(userId);
            return res.status(OK).json(ResponseModel.success('Singel User Details', user));

        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async userVerify(req: Request, res: Response): Promise<Response | void> {
        try {
            const userId = req.params.id
            const user = await this.AdminServices.userVerify(userId)
            //res.status(200).json({ success: true, user });
            return res.status(OK).json(ResponseModel.success('Success', user))
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async userBlockUnBlock(req: Request, res: Response): Promise<Response | void> {
        try {
            const userId = req.params.id
            const user = await this.AdminServices.userBlockUnblock(userId)

            return res.status(OK).json(ResponseModel.success('Success',user))

        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("INTERNAL SERVER ERROR",error as Error))
        }
    }

    

    async getAllBikeDetails(req: Request, res: Response): Promise<Response | void> {
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
            return res.status(OK).json(ResponseModel.success('Bike details Get successfully',bikeDetails))
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR',error as Error));
        }
    }

    async verifyHost(req: Request, res: Response): Promise<Response | void> {
        try {
            const bikeId = req.params.id
            const { reason } = req.body;

            if (reason) {
                console.log(`Revocation reason: ${reason}`);
                const bike = await this.AdminServices.revokeHost(bikeId, reason)
                return res.status(OK).json(ResponseModel.success('Revoked',bike));
            } else {
                const bike = await this.AdminServices.verifyHost(bikeId)
                return res.status(OK).json(ResponseModel.success('Verified',bike));
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR',error as Error));
        }
    }

    async isEditOn(req: Request, res: Response): Promise<Response | void> {
        try {
            const bikeId = req.params.id
            const bike = await this.AdminServices.isEditOn(bikeId)
            return res.status(OK).json(ResponseModel.success('Success',bike))
        } catch (error) {
            console.log("error is from is edit on ", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR',error as Error));
        }
    }

    async getOrderList(req:Request,res:Response):Promise<Response | void>{
        try {
            const orders = await this.AdminServices.getOrder()
            console.log(11,orders);
            

            return res.status(OK).json(ResponseModel.success('Order List Getting Success',{order:orders}))
        } catch (error) {
            console.log("error in admin controller getting order list : ",error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR',error as Error));

        }
    }

    async getOrderDetails(req:Request,res:Response):Promise<Response | void>{
        try {
            console.log("Request received for Order Details", req.params.orderId);
            const orderDetails= await this.AdminServices.orderDetails(req.params.orderId)

            return res.status(OK).json(ResponseModel.success("Order Details Get",orderDetails))
        } catch (error) {
            console.log("error in admin controller getting order details : ",error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR',error as Error));
        }
    }



}

export default AdminController;

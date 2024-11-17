// src/controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/userRepository';

export class AuthController {
    private authService: AuthService;

    constructor() {
        const userRepository = new UserRepository();
        this.authService = new AuthService(userRepository);
    }

    register = async (req: Request, res: Response) => {
        try {
            const { userName, email, password } = req.body;
            const result = await this.authService.register({ userName, email, password });

            this.setTokenCookies(res, result.tokens);

            res.status(201).json({
                message: 'Registration successful',
                user: result.user
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);

            this.setTokenCookies(res, result.tokens);

            res.json({
                message: 'Login successful',
                user: result.user
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    };

    private setTokenCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
}
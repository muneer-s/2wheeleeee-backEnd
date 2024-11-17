// src/services/authService.ts
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/IUser';
import { IUserRepository } from '../interfaces/IUserRepository';
import { JWTUtils } from '../utils/jwtUtils';
import { AppError } from '../types/error';


export class AuthService {
    constructor(private userRepository: IUserRepository) {}

    async register(userData: Omit<IUser, '_id'>) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword
        });

        const tokens = this.generateTokens(user);
        return { user: this.sanitizeUser(user), tokens };
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Invalid credentials',401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new AppError('Invalid credentials',401);
        }

        const tokens = this.generateTokens(user);
        return { user: this.sanitizeUser(user), tokens };
    }

    private generateTokens(user: IUser) {
        const payload = { userId: user._id, email: user.email };
        return {
            accessToken: JWTUtils.generateAccessToken(payload),
            refreshToken: JWTUtils.generateRefreshToken(payload)
        };
    }

    private sanitizeUser(user: IUser) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
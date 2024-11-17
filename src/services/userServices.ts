import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { IUser, IUserResponse } from '../types/types';
import { config } from '../config/config';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    private generateToken(userId: string): string {
        return jwt.sign({ userId }, config.jwtSecret, {
            expiresIn: config.jwtExpiration
        });
    }

    private async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async register(userData: IUser): Promise<IUserResponse> {
        const existingUser = await this.userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword
        });

        const token = this.generateToken(user.id);

        return {
            id: user.id,
            userName: user.userName,
            email: user.email,
            token
        };
    }

    async login(email: string, password: string): Promise<IUserResponse> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await this.validatePassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user.id);

        return {
            id: user.id,
            userName: user.userName,
            email: user.email,
            token
        };
    }
}
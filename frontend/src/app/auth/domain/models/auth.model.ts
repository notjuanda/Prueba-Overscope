import { User } from './user.model';

export interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName?: string | null;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    message: string;
}

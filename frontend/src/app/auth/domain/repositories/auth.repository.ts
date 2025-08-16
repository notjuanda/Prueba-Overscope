import { Observable } from 'rxjs';
import { AuthResponse, LoginInput, RegisterInput } from '../models/auth.model';

export interface AuthRepository {
    register(input: RegisterInput): Observable<AuthResponse>;
    login(input: LoginInput): Observable<AuthResponse>;
    logout(): Observable<void>;
}

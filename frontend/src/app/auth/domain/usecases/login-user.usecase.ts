import { Observable } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthResponse, LoginInput } from '../models/auth.model';

export class LoginUserUseCase {
    constructor(private readonly repo: AuthRepository) {}

    execute(input: LoginInput): Observable<AuthResponse> {
        return this.repo.login(input);
    }
}

import { Observable } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthResponse, RegisterInput } from '../models/auth.model';

export class RegisterUserUseCase {
    constructor(private readonly repo: AuthRepository) {}

    execute(input: RegisterInput): Observable<AuthResponse> {
        return this.repo.register(input);
    }
}

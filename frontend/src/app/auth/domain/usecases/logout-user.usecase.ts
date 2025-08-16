import { Observable } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';

export class LogoutUserUseCase {
    constructor(private readonly repo: AuthRepository) {}

    execute(): Observable<void> {
        return this.repo.logout();
    }
}

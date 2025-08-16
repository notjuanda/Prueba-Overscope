import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthRepositoryImpl } from '../../../auth/data/auth.repository.impl';
import { LogoutUserUseCase } from '../../../auth/domain/usecases/logout-user.usecase';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    isMenuOpen = signal(false);
    
    private logoutUserUseCase: LogoutUserUseCase;

    constructor(
        private router: Router,
        private authRepository: AuthRepositoryImpl
    ) {
        this.logoutUserUseCase = new LogoutUserUseCase(this.authRepository);
    }

    toggleMenu(): void {
        this.isMenuOpen.set(!this.isMenuOpen());
    }

    closeMenu(): void {
        this.isMenuOpen.set(false);
    }

    logout(): void {
        this.logoutUserUseCase.execute().subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: (error) => {
                this.router.navigate(['/login']);
            }
        });
    }

    isActive(route: string): boolean {
        return this.router.url === route;
    }
}

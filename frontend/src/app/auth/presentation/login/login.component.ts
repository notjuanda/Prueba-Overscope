import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthRepositoryImpl } from '../../data/auth.repository.impl';
import { LoginUserUseCase } from '../../domain/usecases/login-user.usecase';
import { LoginInput } from '../../domain/models/auth.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    form: FormGroup;
    private loginUseCase: LoginUserUseCase;
    
    // Signals para el estado
    hidePassword = signal(true);
    submitting = signal(false);
    error = signal<string | null>(null);

    constructor(
        private fb: FormBuilder,
        private authRepository: AuthRepositoryImpl,
        private router: Router
    ) {
        this.loginUseCase = new LoginUserUseCase(this.authRepository);
        
        this.form = this.fb.group({
        email: ['', [
            Validators.required,
            Validators.email,
            Validators.maxLength(120)
        ]],
        password: ['', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(128)
        ]]
        });
    }

    togglePassword(): void {
        this.hidePassword.set(!this.hidePassword());
    }

    submit(): void {
        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }

        this.submitting.set(true);
        this.error.set(null);

        const loginData: LoginInput = {
        email: this.form.value.email,
        password: this.form.value.password
        };

        this.loginUseCase.execute(loginData).subscribe({
        next: (response) => {
            this.submitting.set(false);
            this.router.navigate(['/productos']);
        },
        error: (err) => {
            this.submitting.set(false);
            if (err.status === 401) {
            this.error.set('Credenciales incorrectas. Verifica tu email y contraseña.');
            } else if (err.status === 429) {
            this.error.set('Demasiados intentos. Intenta de nuevo más tarde.');
            } else if (err.error?.message) {
            this.error.set(err.error.message);
            } else {
            this.error.set('Error al iniciar sesión. Intenta de nuevo.');
            }
        }
        });
    }
}

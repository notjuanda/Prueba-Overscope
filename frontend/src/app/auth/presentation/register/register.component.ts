import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthRepositoryImpl } from '../../data/auth.repository.impl';
import { RegisterUserUseCase } from '../../domain/usecases/register-user.usecase';
import { RegisterInput } from '../../domain/models/auth.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    form: FormGroup;
    private registerUseCase: RegisterUserUseCase;
    
    hidePassword = signal(true);
    hideConfirm = signal(true);
    submitting = signal(false);
    error = signal<string | null>(null);

    constructor(
        private fb: FormBuilder,
        private authRepository: AuthRepositoryImpl,
        private router: Router
    ) {
        this.registerUseCase = new RegisterUserUseCase(this.authRepository);
        
        this.form = this.fb.group({
        firstName: ['', [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(60)
        ]],
        lastName: ['', [
            Validators.maxLength(60)
        ]],
        email: ['', [
            Validators.required,
            Validators.email,
            Validators.maxLength(120)
        ]],
        password: ['', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(128)
        ]],
        confirmPassword: ['', [
            Validators.required
        ]]
        }, {
        validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        
        if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordsMismatch: true };
        }
        
        return null;
    }

    togglePassword(): void {
        this.hidePassword.set(!this.hidePassword());
    }

    toggleConfirm(): void {
        this.hideConfirm.set(!this.hideConfirm());
    }

    submit(): void {
        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }

        this.submitting.set(true);
        this.error.set(null);

        const registerData: RegisterInput = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName || null,
        email: this.form.value.email,
        password: this.form.value.password
        };

        this.registerUseCase.execute(registerData).subscribe({
        next: (response) => {
            this.submitting.set(false);
            this.router.navigate(['/dashboard']);
        },
        error: (err) => {
            this.submitting.set(false);
            if (err.status === 409) {
            this.error.set('Este email ya está registrado. Intenta con otro email.');
            } else if (err.status === 422) {
            this.error.set('Datos inválidos. Verifica la información ingresada.');
            } else if (err.status === 429) {
            this.error.set('Demasiados intentos. Intenta de nuevo más tarde.');
            } else if (err.error?.message) {
            this.error.set(err.error.message);
            } else {
            this.error.set('Error al crear la cuenta. Intenta de nuevo.');
            }
        }
        });
    }
}

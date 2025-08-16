import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { AuthResponse, LoginInput, RegisterInput } from '../domain/models/auth.model';
import { environment } from '../../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class AuthRepositoryImpl implements AuthRepository {
    private baseApiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    register(input: RegisterInput): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseApiUrl}/users/register`, input, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
        });
    }

    login(input: LoginInput): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseApiUrl}/users/login`, input, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
        });
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.baseApiUrl}/users/logout`, {}, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
        });
    }
}

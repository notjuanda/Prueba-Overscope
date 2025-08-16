import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    canActivate(): Observable<boolean> {
        return this.checkAuthStatus();
    }

    private checkAuthStatus(): Observable<boolean> {
        return this.http.get(`${environment.apiUrl}/users/me`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).pipe(
            map((response) => {
                return true;
            }),
            catchError((error) => {
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


export const authManagerGuard: CanActivateFn = (route, state) => {
    const http = inject(HttpClient);
    const router = inject(Router);
    const token = localStorage.getItem(environment.tokenManagerStorage);

    if (!token) {
        router.navigate(['/auth/loginManager']);
        return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return http.get<{ valid: boolean }>(
        environment.baseUrl + '/tokenValid/isTokenManagerValid',
        { headers } // Les options doivent être dans le deuxième argument
    ).pipe(
        map(response => {
            if (response.valid) {
                return true;
            } else {
                router.navigate(['/auth/loginManager']);
                return false;
            }
        }),
        catchError(() => {
            router.navigate(['/auth/loginManager']);
            return of(false);
        })
    );

};

export const authClientGuard: CanActivateFn = (route, state) => {
    const http = inject(HttpClient);
    const router = inject(Router);
    const token = localStorage.getItem(environment.tokenClientStorage);

    if (!token) {
        router.navigate(['/auth/loginClient']);
        return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return http.get<{ valid: boolean }>(
        environment.baseUrl + '/tokenValid/isTokenClientValid',
        { headers } // Les options doivent être dans le deuxième argument
    ).pipe(
        map(response => {
            if (response.valid) {
                return true;
            } else {
                router.navigate(['/auth/loginClient']);
                return false;
            }
        }),
        catchError(() => {
            router.navigate(['/auth/loginClient']);
            return of(false);
        })
    );

};

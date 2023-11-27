import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { UsersService } from '../services/administration/users.service';
import { URL_API } from '../common/service-constants';
import { AuthUtils } from './auth.utils';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UsersService
    ) {
    }

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    signIn(credentials: { username: string; password: string; grant_type: string }): Observable<any> {
        if (this._authenticated) {
            return throwError('Usuário já está logado');
        }
        let httpOptions = {
            headers: new HttpHeaders(
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ` + btoa('virtus-api-client:virtuspapipass'),
                })
        };

        let body = new URLSearchParams();
        body.set('grant_type', 'password');
        body.set('username', credentials.username);
        body.set('password', credentials.password);


        return this._httpClient.post(URL_API + '/oauth/token', body, httpOptions).pipe(
            switchMap((response: any) => {
                this.accessToken = response.access_token;
                this.refreshToken = response.refresh_token

                this._authenticated = true;

                this._userService.currentUser = {
                    id: response.id,
                    username: response.username,
                    name: response.name,
                    email: response.email,
                    avatar: '',
                    status: '',
                    role: response.role
                };

                return of(response);
            })
        );
    }

    signInUsingToken(): Observable<any> {
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        let httpOptions = {
            headers: new HttpHeaders(
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ` + btoa('puffup-api-client:puffupapipass'),
                })
        };
        let body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', this.refreshToken);
        return this._httpClient.post(URL_API + '/oauth/token', body, httpOptions).pipe(
            catchError(() =>

                of(false)
            ),
            switchMap((response: any) => {
                if (response.access_token) {
                    this.accessToken = response.access_token;
                }
                if (response.refresh_token) {
                    this.accessToken = response.refresh_token;
                }

                this._authenticated = true;
                this._userService.currentUser = {
                    id: response.id,
                    username: response.username,
                    name: response.name,
                    email: response.email,
                    avatar: '',
                    status: '',
                    role: response.role
                };

                return of(true);
            })
        );
    }

    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        this._authenticated = false;

        return of(true);
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }

        if (!this.refreshToken) {
            return of(false);
        }

        if (AuthUtils.isTokenExpired(this.refreshToken)) {
            return of(false);
        }

        return this.signInUsingToken();
    }
}

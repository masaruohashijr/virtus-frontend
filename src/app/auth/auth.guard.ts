import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { LOGIN } from '../common/route-constants';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanMatch {
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this._check(segments);
    }

    private _check(segments: UrlSegment[]): Observable<boolean | UrlTree> {
        return this._authService.check().pipe(
            switchMap((authenticated) => {

                if (!authenticated) {
                    const redirectURL = `/${segments.join('/')}`;
                    const urlTree = this._router.parseUrl(LOGIN + `?redirectURL=${redirectURL}`);

                    return of(urlTree);
                }
                return of(true);
            })
        );
    }
}

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgAuthService } from '../services/ng-auth.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, take, filter, switchMap } from 'rxjs/operators';

@Injectable()
export class NgAuthInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  refreshUrl: string = '';
  loginUrl: string = '';

  constructor(private authService: NgAuthService, private router: Router) {
    this.refreshUrl = this.authService.getRefreshUrl();
    this.loginUrl = this.authService.getLoginUrl();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      (this.refreshUrl !== '' && req.url.includes(this.refreshUrl)) ||
      (this.loginUrl !== '' && req.url.includes(this.loginUrl))
    ) {
      // refresh and login don't need token
    } else {
      // console.log(this.authService.authToken);
      if (this.authService.authToken) {
        if (this.authService.authToken.accessToken) {
          if (this.authService.authToken.tokenType) {
            req = req.clone({
                setHeaders: {
                    Authorization: `${this.authService.authToken.tokenType} ${this.authService.authToken.accessToken}`
                }
            });
          } else {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.authToken.accessToken}`
                }
            });
          }
        } else {
          console.log('access token is empty, do logout');
          this.logout();
        }
      } else {
        console.log('authToken is empty, do logout');
        this.logout();
      }
    }
    return next.handle(req).pipe(
      catchError(error => {
        // Do not need to refresh token api
        if (
          (this.refreshUrl !== '' && req.url.includes(this.refreshUrl)) ||
          (this.loginUrl !== '' && req.url.includes(this.loginUrl))
        ) {
          // Logout and to redirect it to login page when refresh token failed
          if (this.refreshUrl !== '' && req.url.includes(this.refreshUrl)) {
            console.log('Logout and to redirect it to login page when refresh token failed');
            this.logout();
          }
        }

        // Only handle http status 401
        if (error.status !== 401) {
          return throwError(error);
        }

        this.refreshToken(this.refreshTokenInProgress);
        return this.refreshTokenSubject.pipe(
          filter(result => result !== null),
          take(1),
          switchMap(() => next.handle(this.addAuthenticationToken(req)))
        );
      })
    );
  }

  logout(): void {
    // when refresh fail do logout and redirect to unauthorized page
    this.authService.logout().subscribe(
      logoutSuccess => {
        if (logoutSuccess) {
          this.router.navigate(['/unauthorized']);
        }
      }
    )
  }

  addAuthenticationToken(req: HttpRequest<any>) {
    const accessToken = this.authService.authToken?.accessToken;

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return req;
    }

    // We clone the request, because the original request is immutable
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.authToken?.accessToken}`
      }
    });
  }

  refreshToken(isRefreshing: boolean): void {
    if (isRefreshing) {
      // Someone is refreshing token now, pending request
      console.log('Someone is refreshing token now, pending request');
    } else {
      this.refreshTokenInProgress = true;
      this.authService.refreshToken().subscribe(
        token => {
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(token);
        },
        () => {
          this.refreshTokenInProgress = false;
          this.logout();
        }
      );
    }
  }
}

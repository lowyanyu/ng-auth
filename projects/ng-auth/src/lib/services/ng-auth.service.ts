import { Injectable } from '@angular/core';
import { HandleContext, NgHttphandlerService } from '@cg/ng-httphandler';
import { catchError, map, switchMap } from 'rxjs/operators';
import { iif, Observable, of, throwError } from 'rxjs';
import { NgAuthToken } from '../models/ng-auth-token';
import { NgPrincipal } from '../models/ng-principal';
import { NgAuthSubject } from '../models/ng-auth-subject';
import { UserStatus } from '../enums/user-status';

const httpOptions = { 'Content-Type': 'application/json; charset=utf-8' };

@Injectable()
export class NgAuthService {

  private principal: NgPrincipal;

  public authToken: NgAuthToken | any;
  public authSubject: NgAuthSubject | any;

  currentPermission: { permissionName: string, permissionClass: string }[] = [];

  constructor(
    private httpHandler: NgHttphandlerService
  ) {
    this.principal = new NgPrincipal();
  }

  login(loginUrl: string, refreshUrl: string, credential: any): Observable<HandleContext> {
    this.writeUrl(loginUrl, refreshUrl);
    return (this.httpHandler.post(loginUrl, credential, {optionHeader: httpOptions}) as Observable<HandleContext>).pipe(
      catchError(error => iif(() => (error.errorCode === UserStatus.FIRST_TIME_LOGIN || error.errorCode === UserStatus.PWD_VAILD_TIME), of(error), this.httpHandler.handleError(error))),
      switchMap(resp =>
        iif(() => resp.data !== undefined, of(resp), throwError(new HandleContext({errorCode: -1, errorMessage: '無可用的錯誤訊息'}))),
      ),
      map(resp => {
        this.authToken = resp.data;
        this.principal.addProperty(this.authToken.userInfo);
        this.authSubject = new NgAuthSubject(this.principal, resp.data);
        this.writeAuthSubject(this.authSubject);
        return resp;
      })
    );
  }

  refreshToken(): Observable<any> {
    const param = {
      accessToken: this.authToken.accessToken,
      refreshToken: this.authToken.refreshToken
    };
    const refreshUrl = this.getRefreshUrl();
    return (this.httpHandler.post(refreshUrl, param, {optionHeader: httpOptions}) as Observable<HandleContext>).pipe(
      switchMap(resp =>
        iif(() => resp.data !== undefined, of(resp), throwError(new HandleContext({errorCode: -1, errorMessage: '無可用的錯誤訊息'}))),
      ),
      map(resp => {
        this.authToken = resp.data;
        this.authSubject = this.getAuthSubject();
        this.authSubject.authToken = resp.data;
        this.writeAuthSubject(this.authSubject);
        return resp.data;
      })
    );
  }

  logout(logoutUrl?: string, data?: any): Observable<boolean | any> {
    if (logoutUrl && logoutUrl !== '') {
      return (this.httpHandler.post(logoutUrl, data ? data : {}, {optionHeader: httpOptions}) as Observable<HandleContext>).pipe(
        map(resp => {
          this._removeAuthentication();
          return resp.data;
        })
      );
    } else {
      this._removeAuthentication();
      return of(true);
    }
  }

  _removeAuthentication(): void {
    this.principal = new NgPrincipal();
    this.authToken = undefined;
    this.removeAuthSubject();
    this.removeUrl();
  }

  writeUrl(loginUrl: string, refreshUrl: string): void {
    localStorage.setItem('LoginUrl', loginUrl);
    localStorage.setItem('RefreshUrl', refreshUrl);
  }

  removeUrl(): void {
    localStorage.removeItem('LoginUrl');
    localStorage.removeItem('RefreshUrl');
  }

  getLoginUrl(): string {
    const url = localStorage.getItem('LoginUrl') || '';
    return url;
  }

  getRefreshUrl(): string {
    const url = localStorage.getItem('RefreshUrl') || '';
    return url;
  }

  getPrincipal(): NgPrincipal {
    return this.principal;
  }

  writeAuthSubject(authSubject: NgAuthSubject): void {
    localStorage.setItem('Principal', JSON.stringify(authSubject.principal));
    localStorage.setItem('AuthenticationToken', JSON.stringify(authSubject.authToken));
  }

  getAuthSubject(): NgAuthSubject {
    const principal = new NgPrincipal();
    principal.addProperty(JSON.parse(localStorage.getItem('Principal') as string));
    const authToken = JSON.parse(localStorage.getItem('AuthenticationToken') as string);
    const authSubject = new NgAuthSubject(principal, authToken);
    return authSubject;
  }

  removeAuthSubject(): void {
    localStorage.removeItem('Principal');
    localStorage.removeItem('AuthenticationToken');
  }

  isAuthenticated(): boolean {
    const authSubject =  this.getAuthSubject();
    return (authSubject.principal !== null && authSubject.authToken !== null);
  }

  getCurrentPermission(): void {
    if (this.authToken && this.authToken.scope) {
      this.currentPermission = this.authToken.scope;
    } else {
      this.currentPermission = [];
    }
  }

  hasPermission(permission: string): boolean {
    this.getCurrentPermission();
    return this.currentPermission.some(x => x.permissionName === permission);
  }

  hasPermissionOne(permission: string[]): boolean {
    this.getCurrentPermission();
    let rtn = false;
    permission.forEach(p => {
      if (!rtn) {
        rtn = this.currentPermission.some(x => x.permissionName === p);
      }
    });
    return rtn;
  }

  hasPermissionAll(permission: string[]): boolean {
    this.getCurrentPermission();
    let rtn = true;
    permission.forEach(p => {
      if (rtn) {
        rtn = this.currentPermission.some(x => x.permissionName === p);
      }
    });
    return rtn;
  }

  lackPermission(permission: string): boolean {
    this.getCurrentPermission();
    return !this.currentPermission.some(x => x.permissionName === permission);
  }

  lackPermissionOne(permission: string[]): boolean {
    this.getCurrentPermission();
    let rtn = true;
    permission.forEach(p => {
      if (rtn) {
        rtn = this.currentPermission.some(x => x.permissionName === p);
      }
    });
    return !rtn;
  }

  lackPermissionAll(permission: string[]): boolean {
    this.getCurrentPermission();
    let rtn = false;
    permission.forEach(p => {
      if (!rtn) {
        rtn = this.currentPermission.some(x => x.permissionName === p);
      }
    });
    return !rtn;
  }

}

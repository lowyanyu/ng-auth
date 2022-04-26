import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { NgAuthService } from './ng-auth.service';

@Injectable()
export class NgAuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: NgAuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot | any, state: RouterStateSnapshot | any): boolean | UrlTree {
    if (!this.authService.authToken) {
      const authSubject = this.authService.getAuthSubject();
      if (authSubject.principal !== null && authSubject.authToken !== null) {
        this.authService.authToken = authSubject.authToken;
        this.authService.getPrincipal().addProperty(authSubject.authToken.userInfo);
      }
    }
    if (this.authService.authToken) {
      return true;
    } else {
      return this.router.parseUrl('unauthorized');
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot | any, state: RouterStateSnapshot | any): boolean | UrlTree  {
    if (this.authService.authToken) {
      const permissions = childRoute.data['permissions'] as Array<string>;
      if (permissions !== undefined && permissions.length > 0) {
        let check = false;
        check = this.authService.hasPermissionOne(permissions);
        if (check) {
          return true;
        } else {
          return this.router.parseUrl('forbidden');
        }
      } else {
        return true;
      }
    } else {
      return this.router.parseUrl('unauthorized');
    }
  }

}

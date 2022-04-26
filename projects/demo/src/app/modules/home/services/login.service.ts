import { Inject, Injectable } from '@angular/core';

import { NgHttphandlerService } from '@cg/ng-httphandler';
import { catchError, map } from 'rxjs/operators';
import { NgAuthService } from 'projects/ng-auth/src/public-api';

@Injectable()
export class LoginService {

  loginUrl = '';
  refreshUrl = '';

  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private httpHandler: NgHttphandlerService,
    private authService: NgAuthService
  ) {
    this.loginUrl = `${baseUrl}/rest/management/login`;
    this.refreshUrl = `${baseUrl}/rest/management/refresh`;
  }

  login(account: string, pwd: string) {
    return this.authService.login(this.loginUrl, this.refreshUrl, {account: account, pwd: pwd}).pipe(
      map(resp => {
        return resp;
      }),
      catchError(this.httpHandler.handleError)
    );
  }

}

import { NgAuthToken } from './ng-auth-token';
import { NgPrincipal } from './ng-principal';

export class NgAuthSubject {
  principal: NgPrincipal;
  authToken: NgAuthToken;

  constructor(principal: NgPrincipal | any, authToken: NgAuthToken | any) {
    this.principal = principal;
    this.authToken = authToken;
  }

}

import { Inject, Injectable } from '@angular/core';
import { HandleContext, NgHttphandlerService } from '@cg/ng-httphandler';
import { Observable } from 'rxjs';

const httpOptions = {
  'Content-Type': 'application/json; charset=utf-8'
};

@Injectable()
export class UserService {

  private userUrl = '';

  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private httpHandler: NgHttphandlerService
  ) {
    this.userUrl = `${baseUrl}/rest/management/user/list`;
  }

  /** GET: get Account list from the server */
  getUserPageList(pageSize: number, pageIndex: number): Observable<HandleContext> {
    const params = {
      pageSize: pageSize + '',
      pageIndex: pageIndex + ''
    }
    return this.httpHandler.get(this.userUrl, {qParams: params, optionHeader: httpOptions}) as Observable<HandleContext>;
  }

  getUserPageListFail(pageSize: number, pageIndex: number): Observable<HandleContext> {
    const params = {
      pageSize: pageSize + '',
      pageIndex: pageIndex + ''
    }
    return this.httpHandler.get(`${this.userUrl}/fail`, {qParams: params, optionHeader: httpOptions}) as Observable<HandleContext>;
  }
}

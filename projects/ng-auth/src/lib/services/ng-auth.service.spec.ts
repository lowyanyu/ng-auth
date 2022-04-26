import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HandleContext, NgHttphandlerService, TransferErrorInterceptor } from '@cg/ng-httphandler';
import { NgAuthSubject } from '../models/ng-auth-subject';
import { NgAuthToken } from '../models/ng-auth-token';
import { NgPrincipal } from '../models/ng-principal';
import { NgAuthService } from './ng-auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { UserStatus } from '../enums/user-status';

const authToken = require('test-data/auth-token.json') as NgAuthToken;
const refreshAuthToken = require('test-data/refresh-auth-token.json') as NgAuthToken;
const prin = authToken.userInfo;
const principal = new NgPrincipal();
principal.addProperty(prin);
const emptyAuthSubject = new NgAuthSubject(null, null);
const emptyPrincipalAuthSubject = new NgAuthSubject(principal, null);
const emptyAuthTokenAuthSubject = new NgAuthSubject(null, authToken);
const authSubject = new NgAuthSubject(principal, authToken);
const refreshAuthSubject = new NgAuthSubject(principal, refreshAuthToken);

const httpOptions = {
  'Content-Type': 'application/json; charset=utf-8'
};
const loginSuccess = require('test-data/login/login-success.json');
const loginFirstTime = require('test-data/login/login-first-time.json');
const loginPwdValid = require('test-data/login/login-pwd-valid.json');
const loginFail = require('test-data/login/login-fail.json');
const loginSuccessNoData = require('test-data/login/login-success-no-data.json');
const refreshTokenSuccess = require('test-data/refresh/refresh-success.json');
const refreshTokenFail = require('test-data/refresh/refresh-fail.json');
const refreshTokenSuccessNoData = require('test-data/refresh/refresh-success-no-data.json');
const logoutSuccess = require('test-data/logout/logout-success.json');
const logoutFail = require('test-data/logout/logout-fail.json');

describe('NgAuthService', () => {
  let service: NgAuthService;
  let httpHandler: NgHttphandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        NgAuthService,
        { provide: NgHttphandlerService, useClass: NgHttphandlerService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TransferErrorInterceptor,
          multi: true
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(NgAuthService);
    httpHandler = TestBed.inject(NgHttphandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`#POST "login" testing`, () => {
    const loginUrl = 'http://localhost/rest/login';
    const refreshUrl = 'http://localhost/rest/refresh';
    const credential = {user:'admin',pwd:'12345'};

    /**
     * 測試執行 login()
     * 將 loginUrl、refreshUrl 寫入 localStorage，呼叫 httpHandler POST method
     * [P] errorCode 0: 成功，將取 data 設值 authToken、principal、authSubject，將 principal、authToken 寫入 localStorage
     *     成功但 data undefined: throw HandleContext -1, 無可用錯誤訊息
     * [N] errorCode 66601 | 66602: 視為成功，將取 data 設值 authToken、principal、authSubject，將 principal、authToken 寫入 localStorage
     *     throw HandleContext errorCode, errorMessage
     */

    it('should set url and call httpHandler "POST" method', () => {
      spyOn(httpHandler, 'post').and.callThrough();

      service.login(loginUrl, refreshUrl, credential);

      // 應呼叫 httpHandler POST method
      expect(httpHandler.post).toHaveBeenCalledWith(loginUrl, credential, {optionHeader: httpOptions});
      // 應將 url 存入 localStorage
      expect(localStorage.getItem('LoginUrl')).toBe(loginUrl);
      expect(localStorage.getItem('RefreshUrl')).toBe(refreshUrl);
    });

    it('should set authToken, principal, authSubject and set auth info in localStorage when httpHandler do post success', () => {
      spyOn(httpHandler, 'post').and.returnValue(of(loginSuccess));

      service.login(loginUrl, refreshUrl, credential).subscribe({
        next: (response: HandleContext) => {
          expect(response.errorCode).toBe(0);
          expect(response.errorMessage).toBe(loginSuccess.errorMessage);
          expect(response.data).toEqual(loginSuccess.data);
        }
      });
      expect(service.authSubject).toEqual(authSubject);
      expect(service.getPrincipal()).toEqual(principal);
      // 應將驗證資訊存入 localStorage
      expect(localStorage.getItem('Principal')).toBe(JSON.stringify(principal));
      expect(localStorage.getItem('AuthenticationToken')).toBe(JSON.stringify(authToken));
    });

    it('should set authToken, principal, authSubject and set auth info in localStorage when httpHandler do post catch is first time error', () => {
      spyOn(httpHandler, 'post').and.returnValue(throwError(loginFirstTime));

      service.login(loginUrl, refreshUrl, credential).subscribe({
        next: (response: HandleContext) => {
          expect(response.errorCode).toBe(UserStatus.FIRST_TIME_LOGIN);
          expect(response.errorMessage).toBe(loginFirstTime.errorMessage);
          expect(response.data).toEqual(loginFirstTime.data);
        }
      });
      expect(service.authSubject).toEqual(authSubject);
      expect(service.getPrincipal()).toEqual(principal);
      // 應將驗證資訊存入 localStorage
      expect(localStorage.getItem('Principal')).toBe(JSON.stringify(principal));
      expect(localStorage.getItem('AuthenticationToken')).toBe(JSON.stringify(authToken));
    });

    it('should set authToken, principal, authSubject and set auth info in localStorage when httpHandler do post catch is pwd valid error', () => {
      spyOn(httpHandler, 'post').and.returnValue(throwError(loginPwdValid));

      service.login(loginUrl, refreshUrl, credential).subscribe({
        next: (response: HandleContext) => {
          expect(response.errorCode).toBe(UserStatus.PWD_VAILD_TIME);
          expect(response.errorMessage).toBe(loginPwdValid.errorMessage);
          expect(response.data).toEqual(loginPwdValid.data);
        }
      });
      expect(service.authSubject).toEqual(authSubject);
      expect(service.getPrincipal()).toEqual(principal);
      // 應將驗證資訊存入 localStorage
      expect(localStorage.getItem('Principal')).toBe(JSON.stringify(principal));
      expect(localStorage.getItem('AuthenticationToken')).toBe(JSON.stringify(authToken));
    });

    it('should throw error response when httpHandler do post fail', () => {
      spyOn(httpHandler, 'post').and.returnValue(throwError(loginFail));

      service.login(loginUrl, refreshUrl, credential).subscribe({
        next: response => {},
        error: (error: HandleContext) => {
          expect(error.errorCode).toBe(loginFail.errorCode);
          expect(error.errorMessage).toBe(loginFail.errorMessage);
        }
      });
    });

    it('should throw error response with code -1 and no error msg when httpHandler do post success but return data is undefined', () => {
      spyOn(httpHandler, 'post').and.returnValue(of(loginSuccessNoData));

      service.login(loginUrl, refreshUrl, credential).subscribe({
        next: response => {},
        error: (error: HandleContext) => {
          expect(error.errorCode).toBe(-1);
          expect(error.errorMessage).toBe('無可用的錯誤訊息');
        }
      });
    });

  });

  describe(`#POST "refreshToken" testing`, () => {
    const refreshUrl = 'http://localhost/rest/refresh';

    beforeEach(() => {
      spyOn(service, 'getRefreshUrl').and.returnValue(refreshUrl);
      service.authToken = authToken;
      service.writeAuthSubject(authSubject);
    });

    /**
     * 測試執行 refreshToken()
     * 呼叫 httpHandler POST method
     * [P] errorCode 0: 成功，將取 data 設值 authToken、authSubject，將 principal、authToken 寫入 localStorage
     *     成功但 data undefined: throw HandleContext -1, 無可用錯誤訊息
     * [N] throw HandleContext errorCode, errorMessage
     */

    it('should call httpHandler "POST" method', () => {
      spyOn(httpHandler, 'post').and.callThrough();

      service.refreshToken();

      const param = {
        accessToken: authToken.accessToken,
        refreshToken: authToken.refreshToken
      };
      // 應呼叫 httpHandler POST method
      expect(httpHandler.post).toHaveBeenCalledWith(refreshUrl, param, {optionHeader: httpOptions});
    });

    it('should set authToken, authSubject and set auth info in localStorage when httpHandler do post success', () => {
      spyOn(httpHandler, 'post').and.returnValue(of(refreshTokenSuccess));

      service.refreshToken().subscribe({
        next: response => {
          expect(response).toEqual(refreshAuthToken);
        }
      });
      // 應將驗證資訊存入 localStorage
      expect(localStorage.getItem('Principal')).toBe(JSON.stringify(principal));
      expect(localStorage.getItem('AuthenticationToken')).toBe(JSON.stringify(refreshAuthToken));
    });

    it('should throw error response when httpHandler do post fail', () => {
      spyOn(httpHandler, 'post').and.returnValue(throwError(refreshTokenFail));

      service.refreshToken().subscribe({
        next: response => {},
        error: (error: HandleContext) => {
          expect(error.errorCode).toBe(refreshTokenFail.errorCode);
          expect(error.errorMessage).toBe(refreshTokenFail.errorMessage);
        }
      });
    });

    it('should throw error response with code -1 and no error msg when httpHandler do post success but return data is undefined', () => {
      spyOn(httpHandler, 'post').and.returnValue(of(refreshTokenSuccessNoData));

      service.refreshToken().subscribe({
        next: response => {},
        error: (error: HandleContext) => {
          expect(error.errorCode).toBe(-1);
          expect(error.errorMessage).toBe('無可用的錯誤訊息');
        }
      });
    });

  });

  describe(`#POST "logout" testing`, () => {

    /**
     * 測試執行 logout() 有代入 logoutUrl，表示需要發出 request
     * 呼叫 httpHandler POST method
     * [P] errorCode 0: 成功，將呼叫 _removeAuthentication 以清掉驗證資訊並回傳 data
     * [N] throw HandleContext errorCode, errorMessage
     */
    describe('with logoutUrl', () => {
      const logoutUrl = 'http://localhost/rest/logout';
      const data = {user:'admin'};

      it('should call httpHandler "POST" method with empty body when do logout witout data argument', () => {
        spyOn(httpHandler, 'post').and.callThrough();

        service.logout(logoutUrl);

        // 應呼叫 httpHandler POST method
        expect(httpHandler.post).toHaveBeenCalledWith(logoutUrl, {}, {optionHeader: httpOptions});
      });

      it('should call httpHandler "POST" method with data when do logout with data argument', () => {
        spyOn(httpHandler, 'post').and.callThrough();

        service.logout(logoutUrl, data);

        // 應呼叫 httpHandler POST method
        expect(httpHandler.post).toHaveBeenCalledWith(logoutUrl, data, {optionHeader: httpOptions});
      });

      it('should call _removeAuthentication to clear auth and return response data when httpHandler do post success', () => {
        spyOn(httpHandler, 'post').and.returnValue(of(logoutSuccess));
        spyOn(service, '_removeAuthentication').and.callThrough();

        service.logout(logoutUrl, data).subscribe({
          next: response => {
            expect(response).toBe(logoutSuccess.data);
          }
        });
        expect(service._removeAuthentication).toHaveBeenCalled();
      });

      it('should throw error response when httpHandler do post fail', () => {
        spyOn(httpHandler, 'post').and.returnValue(throwError(logoutFail));

        service.logout(logoutUrl, data).subscribe({
          next: response => {},
          error: (error: HandleContext) => {
            expect(error.errorCode).toBe(logoutFail.errorCode);
            expect(error.errorMessage).toBe(logoutFail.errorMessage);
          }
        });
      });

    });

    /**
     * 測試執行 logout() 不代入 logoutUrl 及 data，表示不需要發 request
     * 單純呼叫 _removeAuthentication 以清掉驗證資訊
     * 並回傳 true
     */
    it('should just call _removeAuthentication to clear auth and return true when call logout without logoutUrl', () => {
      spyOn(service, '_removeAuthentication').and.callThrough();

      service.logout().subscribe({
        next: response => {
          expect(response).toBe(true);
        }
      });
      expect(service._removeAuthentication).toHaveBeenCalled();
    });

  });

  /**
   * 測試執行 _removeAuthentication()
   * 將初始化 authToken、principal、authSubject、url
   */
  it('should clear authentication when call _removeAuthentication', () => {
    service._removeAuthentication();

    expect(service.authSubject).toBeUndefined();
    expect(service.getPrincipal()).toEqual(new NgPrincipal());
    // localStorage 中的資訊應被清空
    expect(localStorage.getItem('LoginUrl')).toBeNull();
    expect(localStorage.getItem('RefreshUrl')).toBeNull();
    expect(localStorage.getItem('Principal')).toBeNull();
    expect(localStorage.getItem('AuthenticationToken')).toBeNull();
  });

  describe(`"getLoginUrl" testing`, () => {
    it('should call localStorage getItem to get LoginUrl, will return url when localStorage has value', () => {
      spyOn(localStorage, 'getItem').and.returnValue('http://localhost/rest/login');

      const url = service.getLoginUrl();

      expect(localStorage.getItem).toHaveBeenCalledWith('LoginUrl');
      expect(url).toBe('http://localhost/rest/login');
    });

    it('should call localStorage getItem to get LoginUrl, will return empty string when localStorage has no value', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const url = service.getLoginUrl();

      expect(localStorage.getItem).toHaveBeenCalledWith('LoginUrl');
      expect(url).toBe('');
    });
  });

  describe(`"getRefreshUrl" testing`, () => {
    it('should call localStorage getItem to get RefreshUrl, will return url when localStorage has value', () => {
      spyOn(localStorage, 'getItem').and.returnValue('http://localhost/rest/refresh');

      const url = service.getRefreshUrl();

      expect(localStorage.getItem).toHaveBeenCalledWith('RefreshUrl');
      expect(url).toBe('http://localhost/rest/refresh');
    });

    it('should call localStorage getItem to get RefreshUrl, will return empty string when localStorage has no value', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const url = service.getRefreshUrl();

      expect(localStorage.getItem).toHaveBeenCalledWith('RefreshUrl');
      expect(url).toBe('');
    });
  });

  describe(`"get Current Permission" testing`, () => {
    it('should set current permission with authToken scope when authToken scope is defined', () => {
      service.authToken = authToken;
      service.getCurrentPermission();
      expect(service.currentPermission).toEqual(authToken.scope);
    });

    it('should set current permission with [] when authToken is undefined', () => {
      service.authToken = undefined;
      service.getCurrentPermission();
      expect(service.currentPermission).toEqual([]);
    });
  });

  describe(`"is Authenticated" testing`, () => {
    it('should return true when authSubject principal and authToken has value', () => {
      spyOn(service, 'getAuthSubject').and.returnValue(authSubject);
      const isAuthenticated = service.isAuthenticated();
      expect(service.getAuthSubject).toHaveBeenCalled();
      expect(isAuthenticated).toBe(true);
    });

    it('should return false when authSubject principal has value but authToken is empty', () => {
      spyOn(service, 'getAuthSubject').and.returnValue(emptyAuthTokenAuthSubject);
      const isAuthenticated = service.isAuthenticated();
      expect(service.getAuthSubject).toHaveBeenCalled();
      expect(isAuthenticated).toBe(false);
    });

    it('should return false when authSubject authToken has value but principal is empty', () => {
      spyOn(service, 'getAuthSubject').and.returnValue(emptyPrincipalAuthSubject);
      const isAuthenticated = service.isAuthenticated();
      expect(service.getAuthSubject).toHaveBeenCalled();
      expect(isAuthenticated).toBe(false);
    });

    it('should return false when authSubject is empty', () => {
      spyOn(service, 'getAuthSubject').and.returnValue(emptyAuthSubject);
      const isAuthenticated = service.isAuthenticated();
      expect(service.getAuthSubject).toHaveBeenCalled();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe(`"has Permission" testing`, () => {
    it('should return true when currentPermission has permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const hasPermission = service.hasPermission('CG_UserSearch');
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermission).toBe(true);
    });

    it('should return false when currentPermission lack permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const hasPermission = service.hasPermission('CG_UserDel');
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermission).toBe(false);
    });

    it('should return false when currentPermission has no value', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = []);
      const hasPermission = service.hasPermission('CG_UserSearch');
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermission).toBe(false);
    });
  });

  describe(`"has Permission One" testing`, () => {
    it('should return true when currentPermission has all permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const hasPermissionOne = service.hasPermissionOne(['CG_UserSearch','CG_UserNew']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermissionOne).toBe(true);
    });

    it('should return true when currentPermission lack any permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const hasPermissionOne = service.hasPermissionOne(['CG_UserDel','CG_UserSearch']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermissionOne).toBe(true);
    });

    it('should return false when currentPermission lack all permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const hasPermissionOne = service.hasPermissionOne(['CG_UserEdit','CG_UserDel']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermissionOne).toBe(false);
    });

    it('should return false when currentPermission has no value', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = []);
      const hasPermissionOne = service.hasPermissionOne(['CG_UserSearch']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermissionOne).toBe(false);
    });
  });

  describe(`"has Permission All" testing`, () => {
    it('should return true when currentPermission has all permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const hasPermissionAll = service.hasPermissionAll(['CG_UserSearch','CG_UserNew']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermissionAll).toBe(true);
    });

    it('should return false when currentPermission lack any permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const hasPermissionAll = service.hasPermissionAll(['CG_UserDel','CG_UserSearch']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermissionAll).toBe(false);
    });

    it('should return false when currentPermission lack all permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const hasPermissionAll = service.hasPermissionAll(['CG_UserEdit','CG_UserDel']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermissionAll).toBe(false);
    });

    it('should return false when currentPermission has no value', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = []);
      const hasPermissionAll = service.hasPermissionAll(['CG_UserSearch']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(hasPermissionAll).toBe(false);
    });
  });

  describe(`"lack Permission" testing`, () => {
    it('should return true when currentPermission lack permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const lackPermission = service.lackPermission('CG_UserDel');
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermission).toBe(true);
    });

    it('should return false when currentPermission has permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const lackPermission = service.lackPermission('CG_UserSearch');
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermission).toBe(false);
    });

    it('should return true when currentPermission has no value', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = []);
      const lackPermission = service.lackPermission('CG_UserDel');
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermission).toBe(true);
    });
  });

  describe(`"lack Permission One" testing`, () => {
    it('should return true when currentPermission lack all permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const lackPermissionOne = service.lackPermissionOne(['CG_UserEdit','CG_UserDel']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermissionOne).toBe(true);
    });

    it('should return true when currentPermission lack any permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const lackPermissionOne = service.lackPermissionOne(['CG_UserDel','CG_UserSearch']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermissionOne).toBe(true);
    });

    it('should return false when currentPermission has all permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const lackPermissionOne = service.lackPermissionOne(['CG_UserSearch','CG_UserNew']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermissionOne).toBe(false);
    });

    it('should return true when currentPermission has no value', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = []);
      const lackPermissionOne = service.lackPermissionOne(['CG_UserSearch']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermissionOne).toBe(true);
    });
  });

  describe(`"lack Permission All" testing`, () => {
    it('should return true when currentPermission lack all permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const lackPermissionAll = service.lackPermissionAll(['CG_UserEdit','CG_UserDel']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermissionAll).toBe(true);
    });

    it('should return false when currentPermission has any permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const lackPermissionAll = service.lackPermissionAll(['CG_UserDel','CG_UserSearch']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermissionAll).toBe(false);
    });

    it('should return false when currentPermission has all permission', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = authToken.scope);
      const lackPermissionAll = service.lackPermissionAll(['CG_UserSearch','CG_UserNew']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermissionAll).toBe(false);
    });

    it('should return true when currentPermission has no value', () => {
      spyOn(service, 'getCurrentPermission').and.callFake(() => service.currentPermission = []);
      const lackPermissionAll = service.lackPermissionAll(['CG_UserSearch']);
      expect(service.getCurrentPermission).toHaveBeenCalled();
      expect(lackPermissionAll).toBe(true);
    });
  });
});

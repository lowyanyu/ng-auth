import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { NgHttphandlerService } from '@cg/ng-httphandler';
import { NgAuthToken } from '../models/ng-auth-token';
import { NgAuthService } from '../services/ng-auth.service';
import { NgAuthInterceptor } from './ng-auth.interceptor';
import { TestInterceptorService } from './test-interceptor.service';

@Component({
  template: ''
})
class TestComponent {}

class MockNgAuthService {
  token: NgAuthToken | undefined;
  set authToken(token) { this.token = token }
  get authToken() { return this.token }
  getLoginUrl() { return 'http://localhost/rest/management/login' }
  getRefreshUrl() { return 'http://localhost/rest/management/refresh' }
  logout() { return of(true) }
  refreshToken() { }
}

const routes: Routes = [
  { path: 'unauthorized', component: TestComponent },
  { path: 'forbidden', component: TestComponent }
];

const authToken = require('test-data/auth-token.json') as NgAuthToken;
const authTokenWithoutAccessToken = require('test-data/auth-token-without-access-token.json') as NgAuthToken;
const authTokenWithoutTokenType = require('test-data/auth-token-without-token-type.json') as NgAuthToken;
const refreshAuthToken = require('test-data/refresh-auth-token.json') as NgAuthToken;

const loginSuccess = require('test-data/login/login-success.json');
const loginFail = require('test-data/login/login-fail.json');
const refreshTokenSuccess = require('test-data/refresh/refresh-success.json');
const refreshTokenFail = require('test-data/refresh/refresh-fail.json');
const apiSuccess = {
  errorCode: 0,
  errorMessage: '',
  data: []
};
const apiFail = {
  errorCode: 66001,
  errorMessage: ''
};

describe('NgAuthInterceptor', () => {
  let service: TestInterceptorService;
  let authService: NgAuthService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let router: Router;
  let interceptor: NgAuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        TestInterceptorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NgAuthInterceptor,
          multi: true
        },
        { provide: NgAuthService, useClass: MockNgAuthService },
        NgHttphandlerService,
        NgAuthInterceptor
      ]
    });
    service = TestBed.inject(TestInterceptorService);
    authService = TestBed.inject(NgAuthService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    interceptor = TestBed.inject(NgAuthInterceptor);
  });

  afterEach(() => {
    // httpMock.verify();
  });

  describe(`"Login" testing`, () => {
    it('should not add Authorization header when login success', () => {
      service.login().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const apiRequest = httpMock.expectOne('http://localhost/rest/management/login');
      expect(apiRequest.request.method).toBe('POST');
      expect(apiRequest.request.headers.has('Authorization')).toBe(false);
      apiRequest.flush(loginSuccess);
    });

    it('should do nothing when login occur error', () => {
      service.login().subscribe(response => {}, error => {
        expect(error.status).toBe(401);
        expect(error.errorCode).not.toBe(0);
      });

      const apiRequest = httpMock.expectOne('http://localhost/rest/management/login');
      apiRequest.flush(loginFail, {
        status: 401,
        statusText: 'Unauthorized'
      });
    });
  });

  describe(`"Refresh Token" testing`, () => {
    it('should not add Authorization header when refresh success', () => {
      service.refreshToken().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const apiRequest = httpMock.expectOne('http://localhost/rest/management/refresh');
      expect(apiRequest.request.method).toBe('POST');
      expect(apiRequest.request.headers.has('Authorization')).toBe(false);
      apiRequest.flush(refreshTokenSuccess);
    });

    it('should do logout when refresh occur error', () => {
      spyOn(console, 'log').and.callThrough();
      spyOn(authService, 'logout').and.callThrough();
      spyOn(router, 'navigate').and.callThrough();

      service.refreshToken().subscribe(response => {}, error => {
        expect(error.status).toBe(400);
        expect(error.errorCode).not.toBe(0);
      });

      const apiRequest = httpMock.expectOne('http://localhost/rest/management/refresh');
      apiRequest.flush(refreshTokenFail, {
        status: 400,
        statusText: 'Bad Request'
      });

      expect(console.log).toHaveBeenCalledWith('Logout and to redirect it to login page when refresh token failed');
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });
  });

  describe(`"GET request" testing`, () => {
    it('should do logout when authToken from auth service is empty', () => {
      spyOn(console, 'log').and.callThrough();
      spyOn(authService, 'logout').and.callThrough();
      spyOn(router, 'navigate').and.callThrough();

      service.getRequest().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
      expect(apiRequest.request.method).toBe('GET');

      expect(console.log).toHaveBeenCalledWith('authToken is empty, do logout');
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
      apiRequest.flush(apiSuccess);
    });

    describe('authToken has value', () => {
      it('should do logout when accessToken of authToken is empty', async () => {
        spyOnProperty(authService, 'authToken', 'get').and.returnValue(authTokenWithoutAccessToken);
        spyOn(console, 'log').and.callThrough();
        spyOn(authService, 'logout').and.callThrough();
        spyOn(router, 'navigate').and.callThrough();

        service.getRequest().subscribe(response => {
          expect(response).toBeTruthy();
        });

        const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
        expect(apiRequest.request.method).toBe('GET');

        expect(console.log).toHaveBeenCalledWith('access token is empty, do logout');
        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
        apiRequest.flush(apiSuccess);
      });

      describe('accessToken has value', () => {
        it('should set Authorization header with tokenType and accessToken when tokenType has value', () => {
          spyOnProperty(authService, 'authToken', 'get').and.returnValue(authTokenWithoutTokenType);

          service.getRequest().subscribe(response => {
            expect(response).toBeTruthy();
          });

          const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
          expect(apiRequest.request.method).toBe('GET');
          expect(apiRequest.request.headers.has('Authorization')).toBe(true);
          expect(apiRequest.request.headers.get('Authorization')).toBe(`${authToken.tokenType} ${authToken.accessToken}`);
          apiRequest.flush(apiSuccess);
        });

        it('should set Authorization header with default tokenType "Bearer" and accessToken when tokenType is empty', () => {
          spyOnProperty(authService, 'authToken', 'get').and.returnValue(authToken);

          service.getRequest().subscribe(response => {
            expect(response).toBeTruthy();
          });

          const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
          expect(apiRequest.request.method).toBe('GET');
          expect(apiRequest.request.headers.has('Authorization')).toBe(true);
          expect(apiRequest.request.headers.get('Authorization')).toBe(`Bearer ${authToken.accessToken}`);
          apiRequest.flush(apiSuccess);
        });
      });
    });

    describe('GET request occur error with status 401 unauthorized', () => {
      it('should set new authToken when refresh token success', async () => {
        let refreshed = false;
        spyOnProperty(authService, 'authToken', 'get').and.callFake(() => {
          if (refreshed) {
            return refreshAuthToken;
          }
          refreshed = true;
          return authToken;
        });
        spyOn(authService, 'refreshToken').and.returnValue(of(refreshAuthToken));

        service.getRequest().subscribe(response => {}, error => {
          expect(error.status).toBe(401);
          expect(error.errorCode).not.toBe(0);
        });

        const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
        apiRequest.flush(apiFail, {
          status: 401,
          statusText: 'Unauthorized'
        });

        expect(apiRequest.request.method).toBe('GET');
        expect(apiRequest.request.headers.has('Authorization')).toBe(true);
        expect(apiRequest.request.headers.get('Authorization')).toBe(`Bearer ${refreshAuthToken.accessToken}`);
      });

      it('should not add Authorization header when refresh token success but accessToken is empty', async () => {
        let refreshed = false;
        spyOnProperty(authService, 'authToken', 'get').and.callFake(() => {
          if (refreshed) {
            return authTokenWithoutAccessToken;
          }
          refreshed = true;
          return authToken;
        });
        spyOn(authService, 'refreshToken').and.returnValue(of(authTokenWithoutAccessToken));

        service.getRequest().subscribe(response => {}, error => {
          expect(error.status).toBe(401);
          expect(error.errorCode).not.toBe(0);
        });

        const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
        apiRequest.flush(apiFail, {
          status: 401,
          statusText: 'Unauthorized'
        });

        expect(apiRequest.request.method).toBe('GET');
        expect(apiRequest.request.headers.has('Authorization')).toBe(false);
      });

      it('should remain old authToken and do logout when refresh token fail', () => {
        spyOnProperty(authService, 'authToken', 'get').and.returnValue(authToken);
        spyOn(authService, 'refreshToken').and.returnValue(throwError({status: 400}));

        service.getRequest().subscribe(response => {}, error => {
          expect(error.status).toBe(401);
          expect(error.errorCode).not.toBe(0);
        });

        const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
        apiRequest.flush(apiFail, {
          status: 401,
          statusText: 'Unauthorized'
        });

        expect(apiRequest.request.method).toBe('GET');
        expect(apiRequest.request.headers.has('Authorization')).toBe(true);
        expect(apiRequest.request.headers.get('Authorization')).toBe(`Bearer ${authToken.accessToken}`);
        expect(apiRequest.cancelled).toBe(true);
      });

    });
  });

  describe(`"POST request" testing`, () => {
    it('should do logout when authToken from auth service is empty', () => {
      spyOn(console, 'log').and.callThrough();
      spyOn(authService, 'logout').and.callThrough();
      spyOn(router, 'navigate').and.callThrough();

      service.postRequest().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
      expect(apiRequest.request.method).toBe('POST');

      expect(console.log).toHaveBeenCalledWith('authToken is empty, do logout');
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
      apiRequest.flush(apiSuccess);
    });

    describe('authToken has value', () => {
      it('should do logout when accessToken of authToken is empty', async () => {
        spyOnProperty(authService, 'authToken', 'get').and.returnValue(authTokenWithoutAccessToken);
        spyOn(console, 'log').and.callThrough();
        spyOn(authService, 'logout').and.callThrough();
        spyOn(router, 'navigate').and.callThrough();

        service.postRequest().subscribe(response => {
          expect(response).toBeTruthy();
        });

        const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
        expect(apiRequest.request.method).toBe('POST');

        expect(console.log).toHaveBeenCalledWith('access token is empty, do logout');
        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
        apiRequest.flush(apiSuccess);
      });

      describe('accessToken has value', () => {
        it('should set Authorization header with tokenType and accessToken when tokenType has value', () => {
          spyOnProperty(authService, 'authToken', 'get').and.returnValue(authTokenWithoutTokenType);

          service.postRequest().subscribe(response => {
            expect(response).toBeTruthy();
          });

          const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
          expect(apiRequest.request.method).toBe('POST');
          expect(apiRequest.request.headers.has('Authorization')).toBe(true);
          expect(apiRequest.request.headers.get('Authorization')).toBe(`${authToken.tokenType} ${authToken.accessToken}`);
          apiRequest.flush(apiSuccess);
        });

        it('should set Authorization header with default tokenType "Bearer" and accessToken when tokenType is empty', () => {
          spyOnProperty(authService, 'authToken', 'get').and.returnValue(authToken);

          service.postRequest().subscribe(response => {
            expect(response).toBeTruthy();
          });

          const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
          expect(apiRequest.request.method).toBe('POST');
          expect(apiRequest.request.headers.has('Authorization')).toBe(true);
          expect(apiRequest.request.headers.get('Authorization')).toBe(`Bearer ${authToken.accessToken}`);
          apiRequest.flush(apiSuccess);
        });
      });
    });

    describe('POST request occur error with status 401 unauthorized', () => {
      it('should set new authToken when refresh token success', async () => {
        let refreshed = false;
        spyOnProperty(authService, 'authToken', 'get').and.callFake(() => {
          if (refreshed) {
            return refreshAuthToken;
          }
          refreshed = true;
          return authToken;
        });
        spyOn(authService, 'refreshToken').and.returnValue(of(refreshAuthToken));

        service.postRequest().subscribe(response => {}, error => {
          expect(error.status).toBe(401);
          expect(error.errorCode).not.toBe(0);
        });

        const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
        apiRequest.flush(apiFail, {
          status: 401,
          statusText: 'Unauthorized'
        });

        expect(apiRequest.request.method).toBe('POST');
        expect(apiRequest.request.headers.has('Authorization')).toBe(true);
        expect(apiRequest.request.headers.get('Authorization')).toBe(`Bearer ${refreshAuthToken.accessToken}`);
      });

      it('should not add Authorization header when refresh token success but accessToken is empty', async () => {
        let refreshed = false;
        spyOnProperty(authService, 'authToken', 'get').and.callFake(() => {
          if (refreshed) {
            return authTokenWithoutAccessToken;
          }
          refreshed = true;
          return authToken;
        });
        spyOn(authService, 'refreshToken').and.returnValue(of(authTokenWithoutAccessToken));

        service.postRequest().subscribe(response => {}, error => {
          expect(error.status).toBe(401);
          expect(error.errorCode).not.toBe(0);
        });

        const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
        apiRequest.flush(apiFail, {
          status: 401,
          statusText: 'Unauthorized'
        });

        expect(apiRequest.request.method).toBe('POST');
        expect(apiRequest.request.headers.has('Authorization')).toBe(false);
      });

      it('should remain old authToken and do logout when refresh token fail', () => {
        spyOnProperty(authService, 'authToken', 'get').and.returnValue(authToken);
        spyOn(authService, 'refreshToken').and.returnValue(throwError({status: 400}));

        service.postRequest().subscribe(response => {}, error => {
          expect(error.status).toBe(401);
          expect(error.errorCode).not.toBe(0);
        });

        const apiRequest = httpMock.expectOne('http://localhost/rest/management/user');
        apiRequest.flush(apiFail, {
          status: 401,
          statusText: 'Unauthorized'
        });

        expect(apiRequest.request.method).toBe('POST');
        expect(apiRequest.request.headers.has('Authorization')).toBe(true);
        expect(apiRequest.request.headers.get('Authorization')).toBe(`Bearer ${authToken.accessToken}`);
        expect(apiRequest.cancelled).toBe(true);
      });

    });
  });

  describe(`"Refresh token when someone is refreshing token" testing`, () => {
    it('should console is pending request and not to call authService refreshToken', () => {
      spyOnProperty(authService, 'authToken', 'get').and.returnValue(authToken);
      // let refreshToken hanging
      spyOn(authService, 'refreshToken').and.returnValue(of());
      spyOn(console, 'log').and.callThrough();

      // first request
      service.getRequest().subscribe(response => {}, error => {
        expect(error.status).toBe(401);
        expect(error.errorCode).not.toBe(0);
      });

      // second request
      service.getRequest().subscribe(response => {}, error => {
        expect(error.status).toBe(401);
        expect(error.errorCode).not.toBe(0);
      });

      // both request 401, need to do refresh
      const apiRequest = httpMock.match('http://localhost/rest/management/user');
      apiRequest[0].flush(apiFail, {
        status: 401,
        statusText: 'Unauthorized'
      });
      apiRequest[1].flush(apiFail, {
        status: 401,
        statusText: 'Unauthorized'
      });

      expect(console.log).toHaveBeenCalledWith('Someone is refreshing token now, pending request');
    })
  });

});

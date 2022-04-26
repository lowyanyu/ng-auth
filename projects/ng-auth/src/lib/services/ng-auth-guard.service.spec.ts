import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgAuthSubject } from '../models/ng-auth-subject';
import { NgAuthToken } from '../models/ng-auth-token';
import { NgPrincipal } from '../models/ng-principal';
import { NgAuthGuard } from './ng-auth-guard.service';
import { NgAuthService } from './ng-auth.service';

class MockNgAuthService {
  token: NgAuthToken | undefined;
  get authToken() { return this.token }
  set authToken(token) { this.token = token }
  getAuthSubject() { return undefined }
  getPrincipal() {}
  hasPermissionOne(permission: string[]) {}
}

const authToken = require('test-data/auth-token.json') as NgAuthToken;
const prin = authToken.userInfo;
const principal = new NgPrincipal();
principal.addProperty(prin);
const emptyAuthSubject = new NgAuthSubject(null, null);
const emptyPrincipalAuthSubject = new NgAuthSubject(principal, null);
const emptyAuthTokenAuthSubject = new NgAuthSubject(null, authToken);
const validAuthSubject = new NgAuthSubject(principal, authToken);

describe('NgAuthGuard', () => {
  let authGuard: NgAuthGuard;
  let router: Router;
  let authService: NgAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        NgAuthGuard,
        { provide: NgAuthService, useClass: MockNgAuthService }
      ]
    });
    authGuard = TestBed.inject(NgAuthGuard);
    router = TestBed.inject(Router);
    authService = TestBed.inject(NgAuthService);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  describe(`"Can Activate" testing`, () => {
    /**
     * 功能說明：判斷 NgAuthService 中的 authToken 是否有值
     * [P] 若 service 取得 authToken 有值則有權限，將 return true；
     * 若 service 取得 authToken 為空值將呼叫 getAuthSubject 取得 localStorage 中存放的 NgAuthSubject
     *     [P] 當 authSubject 有值則有權限，會重新塞值給 service authToken 並 return true；
     *     [N] 當 authSubject 也是空的則為無權限，將 return UrlTree unauthorized
     *     [N] 當 authSubject principal 有值，authToken 卻是空值仍為無權限，將 return UrlTree unauthorized
     *     [N] 當 authSubject authToken 有值，principal 卻是空值仍為無權限，將 return UrlTree unauthorized
    */
    it('[P] should return true when authToken from NgAuthService has value', () => {
      spyOnProperty(authService, 'authToken', 'get').and.returnValue(validAuthSubject);

      const rtn = authGuard.canActivate(null, null);

      expect(rtn).toBe(true);
    });

    describe('authToken from NgAuthService is empty', () => {
      beforeEach(() => {
        spyOnProperty(authService, 'authToken', 'get').and.callThrough();
        spyOnProperty(authService, 'authToken', 'set').and.callThrough();
      });

      it('[P] should return true when authSubject from getAuthSubject has principal and authToken', () => {
        spyOn(authService, 'getAuthSubject').and.returnValue(validAuthSubject);
        spyOn(authService, 'getPrincipal').and.returnValue(new NgPrincipal());
        spyOn(authService.getPrincipal(), 'addProperty').and.callFake(() => {});

        const rtn = authGuard.canActivate(null, null);

        // 預期呼叫 service getAuthSubject() 取 localStorage 中是否有 authSubject
        expect(authService.getAuthSubject).toHaveBeenCalled();
        expect(authService.authToken).toEqual(validAuthSubject.authToken);
        expect(authService.getPrincipal().addProperty).toHaveBeenCalledWith(prin);
        expect(rtn).toBe(true);
      });

      it('[N] should parse unauthorized urlTree when authSubject from getAuthSubject principal and authToken is null', () => {
        spyOn(authService, 'getAuthSubject').and.returnValue(emptyAuthSubject);
        spyOn(router, 'parseUrl').and.callThrough();

        const rtn = authGuard.canActivate(null, null);

        // 預期呼叫 service getAuthSubject() 取 localStorage 中是否有 authSubject
        expect(authService.getAuthSubject).toHaveBeenCalled();
        expect(router.parseUrl).toHaveBeenCalledWith('unauthorized');
      });

      it('[N] should parse unauthorized urlTree when authSubject from getAuthSubject principal has value but authToken is null', () => {
        spyOn(authService, 'getAuthSubject').and.returnValue(emptyPrincipalAuthSubject);
        spyOn(router, 'parseUrl').and.callThrough();

        const rtn = authGuard.canActivate(null, null);

        // 預期呼叫 service getAuthSubject() 取 localStorage 中是否有 authSubject
        expect(authService.getAuthSubject).toHaveBeenCalled();
        expect(router.parseUrl).toHaveBeenCalledWith('unauthorized');
      });

      it('[N] should parse unauthorized urlTree when authSubject from getAuthSubject authToken has value but principal is null', () => {
        spyOn(authService, 'getAuthSubject').and.returnValue(emptyAuthTokenAuthSubject);
        spyOn(router, 'parseUrl').and.callThrough();

        const rtn = authGuard.canActivate(null, null);

        // 預期呼叫 service getAuthSubject() 取 localStorage 中是否有 authSubject
        expect(authService.getAuthSubject).toHaveBeenCalled();
        expect(router.parseUrl).toHaveBeenCalledWith('unauthorized');
      });

    });

  });

  describe(`"Can Activate Child" testing`, () => {
    /**
     * 功能說明：判斷 NgAuthService 中的 authToken 是否有值
     * 若 service 取得 authToken 有值則有權限，將進而判斷 childRoute 中 data['permissions']；
     *     [P] 無特別設置 permissions，都將 return true；
     *     有設置 permissions，呼叫 hasPermissionOne 檢查是否有權限
     *         [P] hasPermissionOne true 則有該頁面權限，return true；
     *         [N] hasPermissionOne false 則無該頁面權限，return false
     * [N] 若 service 取得 authToken 為空值則為無權限，將 return UrlTree unauthorized
    */
    describe('authToken from NgAuthService has value', () => {
      beforeEach(() => {
        spyOnProperty(authService, 'authToken', 'get').and.returnValue(validAuthSubject);
      });

      it('[P] should return true when no set permissions in childRoute', () => {
        const mockRoute = { data: {} } as ActivatedRouteSnapshot;
        mockRoute.data['permissions'] = [];
        const rtn = authGuard.canActivateChild(mockRoute, null);

        expect(rtn).toBe(true);
      });

      it('[P] should return true when set permissions in childRoute has permission', () => {
        spyOn(authService, 'hasPermissionOne').and.returnValue(true);

        const mockRoute = { data: {} } as ActivatedRouteSnapshot;
        mockRoute.data['permissions'] = ['CG_UserSearch'];
        const rtn = authGuard.canActivateChild(mockRoute, null);

        expect(rtn).toBe(true);
      });

      it('[N] should parse forbidden urlTree when set permissions in childRoute no permission', () => {
        spyOn(authService, 'hasPermissionOne').and.returnValue(false);
        spyOn(router, 'parseUrl').and.callThrough();

        const mockRoute = { data: {} } as ActivatedRouteSnapshot;
        mockRoute.data['permissions'] = ['CG_UserSearch'];
        const rtn = authGuard.canActivateChild(mockRoute, null);

        expect(router.parseUrl).toHaveBeenCalledWith('forbidden');
      });
    });

    it('[N] should parse unauthorized urlTree when authToken from NgAuthService is empty', () => {
      spyOnProperty(authService, 'authToken', 'get').and.returnValue(null);
      spyOn(router, 'parseUrl').and.callThrough();

      const rtn = authGuard.canActivateChild(null, null);

      expect(router.parseUrl).toHaveBeenCalledWith('unauthorized');
    });
  });
});

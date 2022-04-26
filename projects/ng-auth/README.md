# NgAuth

v.4.1.0
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.16.

下方為異動歷程記錄，須瞭解說明請觀看[文件說明](#read-me)


| 分類 | 日期         | 更新內容簡述 | Redmine ID | RD | 更新版號
|:--- |:-------------|:-------------|:---|:-----|:-----------
| 新功能 | 2022/03/29 | 整入 HttpHandler 取代 ErrorHandler | #0 | Christy | 4.1.0
| 臭蟲 | 2022/03/16 | 修正寫入 authSubject 之 authToken 資料型態錯誤問題 | #0 | Christy | 4.0.1
| 新功能 | 2022/03/15 | Angular 升級至 12 | #0 | Christy | 4.0.0
| 新功能 | 2021/08/23 | Login response 中新增會塞入 principal 中的使用者資訊 userInfo | #0 | Christy | 3.0.0
| 新功能 | 2021/08/19 | 自動化測試撰寫及程式碼微調 | #0 | Christy | 2.0.2


---

## Read me

1. 包含以下欄位 **分類**, **日期**, **更新內容簡述**, **Redmine ID**, **RD**, **更新版號**

類型包含以下分類

1. 新功能
2. 臭蟲
3. 需求變更
4. 埋Log

---

## Documentation

- NgAuthModule
- Services
  - [NgAuthService](#NgAuthService)
  - [NgAuthGuard](#NgAuthGuard)
- Models
  - [NgAuthToken](#NgAuthToken)
  - [NgPrincipal](#NgPrincipal)
  - [NgAuthSubject](#NgAuthSubject)
- Directives
  - [isAuthenticated](#isAuthenticated1)
  - [hasPermission](#hasPermission1)
  - [hasPermissionOne](#hasPermissionOne1)
  - [hasPermissionAll](#hasPermissionAll1)
  - [lackPermission](#lackPermission1)
  - [lackPermissionOne](#lackPermissionOne1)
  - [lackPermissionAll](#lackPermissionAll1)
- Interceptors
  - [NgAuthInterceptor](#NgAuthInterceptor)

------------

## Services

### NgAuthService

提供當前 User、角色和授權的相關訊息，可以進行登入、登出、權限驗證、取得 User 資訊信息、session。

#### Property

- authToken: [NgAuthToken](#NgAuthToken)
- principal: [NgPrincipal](#NgPrincipal)
- authSubject: [NgAuthSubject](#NgAuthSubject)
- currentPermission: { permissionName: string, permissionClass: string }[]

#### Method

- [login](#login)
- [refreshToken](#refreshToken)
- [logout](#logout)
- [writeUrl](#writeUrl)
- [removeUrl](#removeUrl)
- [getLoginUrl](#getLoginUrl)
- [getRefreshUrl](#getRefreshUrl)
- [getPrincipal](#getPrincipal)
- [writeAuthSubject](#writeAuthSubject)
- [getAuthSubject](#getAuthSubject)
- [removeAuthSubject](#removeAuthSubject)
- [isAuthenticated](#isAuthenticated)
- [getCurrentPermission](#getCurrentPermission)
- [hasPermission](#hasPermission)
- [hasPermissionOne](#hasPermissionOne)
- [hasPermissionAll](#hasPermissionAll)
- [lackPermission](#lackPermission)
- [lackPermissionOne](#lackPermissionOne)
- [lackPermissionAll](#lackPermissionAll)

##### login

`login(loginUrl: string, refreshUrl: string, credential: any): Observable<HandleContext>`

- Parameters
  - loginUrl: 型態 string，要 Post 到哪裡驗證
  - refreshUrl: 型態 string，要 Post 到哪裡驗證
  - credential: 型態 any，要驗證的資訊，由呼叫者隨意帶。
- Return
  - Observable&lt;HandleContext&gt;

##### refreshToken

Token 逾期的時候打到 refreshUrl 以取得新一組 Token

`refreshToken(): Observable<any>`

- No Parameters
- Return
  - Observable&lt;any&gt;

##### logout

清除 authToken、principal、authSubject
根據有無代入 logoutUrl 來判斷是否要 Post 做登出

`logout(logoutUrl?: string, data?: any): Observable<boolean | any>`

- Parameters
  - logoutUrl: 型態 string，要 Post 到哪裡做登出，可帶可不帶
  - data: 型態 any，要帶去做登出的資訊，可帶可不帶
- Return
  - 沒有 logoutUrl，Observable&lt;boolean&gt;: 成功 true, 失敗 false
  - 有 logoutUrl, Observable&lt;any&gt;: Server 回傳的訊息

##### writeUrl

`writeUrl(loginUrl: string, refreshUrl: string): void`

- Parameters
  - loginUrl: 型態 string
  - refreshUrl: 型態 string
- Return
  - None

##### removeUrl

`removeUrl(): void`

- No Parameters
- Return
  - None

##### getLoginUrl

`getLoginUrl(): string`

- No Parameters
- Return
  - string

##### getRefreshUrl

`getRefreshUrl(): string`

- No Parameters
- Return
  - string

##### getPrincipal

`getPrincipal(): NgPrincipal`

- No Parameters
- Return
  - [NgPrincipal](#NgPrincipal)

##### writeAuthSubject

`writeAuthSubject(authSubject: NgAuthSubject): void`

- Parameters
  - [NgAuthSubject](#NgAuthSubject)
- Return
  - None

##### getAuthSubject

`getAuthSubject(): NgAuthSubject`

- No Parameters
- Return
  - [NgAuthSubject](#NgAuthSubject)

##### removeAuthSubject

`removeAuthSubject(): void`

- No Parameters
- Return
  - None

##### isAuthenticated

`isAuthenticated(): boolean`

- No Parameters
- Return
  - boolean: 有登入 true, 未登入 false

##### getCurrentPermission

`getCurrentPermission(): void`

- No Parameters
- Return
  - None

##### hasPermission

`hasPermission(permission: string): boolean`

- Parameters
  - permission: 型態 string
- Return
  - boolean: 有權限 true, 無權限 false

##### hasPermissionOne

`hasPermissionOne(permission: string[]): boolean`

- Parameters
  - permission: 型態 string[]
- Return
  - boolean: 有任一權限 true, 無任何權限 false

##### hasPermissionAll

`hasPermissionAll(permission: string[]): boolean`

- Parameters
  - permission: 型態 string[]
- Return
  - boolean: 有所有權限 true, 無任一權限 false

##### lackPermission

`lackPermission(permission: string): boolean`

- Parameters
  - permission: 型態 string
- Return
  - boolean: 無權限 true, 有權限 false

##### lackPermissionOne

`lackPermissionOne(permission: string[]): boolean`

- Parameters
  - permission: 型態 string[]
- Return
  - boolean: 無任一權限 true, 有所有權限 false

##### lackPermissionAll

`lackPermissionAll(permission: string[]): boolean`

- Parameters
  - permission: 型態 string[]
- Return
  - boolean: 無所有權限 true, 有任一權限 false

------------

### NgAuthGuard

需在 AppRoutingModule 中加上 unauthorized 及 forbidden 的 component 路徑:
```typescript
const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'management', loadChildren: () => import('./management/management.module').then(m => m.ManagementModule) },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'forbidden', component: ForbiddenComponent }
];
```
> **提示**: 若想設 forbidden path 在 management 底下，可按照以下設定 routing

在 AppRoutingModule 中的 forbidden 設定 redirectTo:
```typescript
const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'management', loadChildren: () => import('./management/management.module').then(m => m.ManagementModule) },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'forbidden', redirectTo: 'management/forbidden', pathMatch: 'full' }
];
```
然後在 ManagementRoutingModule 中設定 forbidden 的 component 路徑:
```typescript
const routes: Routes = [
  {
    path: '',
    component: LoginedLayoutComponent,
    canActivate: [NgAuthGuard],
    canActivateChild: [NgAuthGuard],
    children: [
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: '系統管理者',
          permissions: ['CG_User']
        }
      }
    ]
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  }
];
```

#### Method

- [canActivate](#canActivate)
- [canActivateChild](#canActivateChild)

##### canActivate

`canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree`

- Parameters
  - route: 型態 ActivatedRouteSnapshot
  - state: RouterStateSnapshot
- Return
  - boolean: true, 有登入且有權限
  - UrlTree: unauthorized 未登入

##### canActivateChild

檢查 RoutingModule 設定的 permission

`canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree`

- Parameters
  - route: 型態 ActivatedRouteSnapshot
  - state: RouterStateSnapshot
- Return
  - boolean: true, 有登入且有權限
  - UrlTree: forbidden 有登入但無權限 / unauthorized 未登入

------------
## Models

### NgAuthToken

#### Property

- accessToken: string
- refreshToken: string
- tokenType: string
- expiresIn: number, unit second
- scope: { permissionName: string, permissionClass: string }[]
- userInfo: any

------------

### NgPrincipal
Principal 是指一個可辨識的唯一身分，用來代表一個人一個公司，一個裝置或另一個系統，並不限定於代表一個人；而使用者 (User) 是指與系統互動的操作者 (人)。
Principal 內可能有 uuid、DB 中的 Primary Key、LDAP UUID 或 DN、UserName、Email 或身分證字號等等。

#### Property

None

#### Method

- [addProperty](#addProperty)
- [getProperty](#getProperty)

##### addProperty

`addProperty(data: Partial<NgPrincipal>): void`

- Parameters
  - data: 型態 Partial&lt;NgPrincipal&gt;。
- Return
  - None

##### getProperty

`getProperty(key: any): any`

- Parameters
  - key: 型態 any
- Return
  - any

------------

### NgAuthSubject

#### Property

- principal: [NgPrincipal](#NgPrincipal)
- authToken: [NgAuthToken](#NgAuthToken)

------------

## Directives

是否登入及權限相關的自訂 directives 用於定義 html 元素

### isAuthenticated
```xml
<!-- show block when is authenticated -->
<div *isAuthenticated></div>
```
- selector: [isAuthenticated]
- No Inputs

------------

### hasPermission
```html
<!-- show block when has CG_UserAdd permission -->
<div *hasPermission="'CG_UserAdd'"></div>
```
- selector: [hasPermission]
- Inputs
  - permission: 型態 string

------------

### hasPermissionOne
```html
<!-- show block when has CG_UserAdd or CG_UserEdit permission -->
<div *hasPermissionOne="'CG_UserAdd,CG_UserEdit'"></div>
```
- selector: [hasPermissionOne]
- Inputs
  - permission: 型態 string

------------

### hasPermissionAll
```html
<!-- show block when has CG_UserAdd and CG_UserEdit permission -->
<div *hasPermissionAll="'CG_UserAdd,CG_UserEdit'"></div>
```
- selector: [hasPermissionAll]
- Inputs
  - permission: 型態 string

------------

### lackPermission
```html
<!-- show block when lack of CG_UserAdd permission -->
<div *lackPermission="'CG_UserAdd'"></div>
```
- selector: [lackPermission]
- Inputs
  - permission: 型態 string

------------

### lackPermissionOne
```html
<!-- show block when lack of CG_UserAdd or CG_UserEdit permission -->
<div *lackPermissionOne="'CG_UserAdd,CG_UserEdit'"></div>
```
- selector: [lackPermissionOne]
- Inputs
  - permission: 型態 string

------------

### lackPermissionAll
```html
<!-- show block when lack of CG_UserAdd and CG_UserEdit permission -->
<div *lackPermissionAll="'CG_UserAdd,CG_UserEdit'"></div>
```
- selector: [lackPermissionAll]
- Inputs
  - permission: 型態 string

------------

## Interceptors

### NgAuthInterceptor

集中處理我們的所有 Http request 和 response，除 login 及 refresh 外其餘 request 都會於標頭加上 Authorization 以讓 server 做 token 的驗證。

當 Server 回傳 status 401 時，會先做一次 refreshToken，再用 refreshToken 去執行後續操作，若 refreshToken 也失效則做登出。

登出將清除 authToken、principal、authSubject，並導到 unauthorized 頁面。

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgAuthGuard } from 'projects/ng-auth/src/public-api';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { Page3Component } from './pages/page3/page3.component';
import { LoginedLayoutComponent } from './components/logined-layout/logined-layout.component';

const routes: Routes = [
  {
    path: '',
    component: LoginedLayoutComponent,
    canActivate: [NgAuthGuard],
    canActivateChild: [NgAuthGuard],
    children: [
      {
        path: 'page1',
        component: Page1Component,
        data: {
          title: '系統管理者',
          permissions: ['CG_Page1']
        },
        children: [
          { path: 'page1-2', component: Page2Component, data: { permissions: ['CG_Page2'] } }
        ]
      },
      {
        path: 'page2',
        component: Page2Component,
        data: {
          title: '系統管理者',
          permissions: ['CG_Page2']
        }
      },
      {
        path: 'page3',
        component: Page3Component,
        data: {
          title: '系統管理者',
          permissions: ['CG_Page3']
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }

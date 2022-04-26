import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgHttphandlerService } from '@cg/ng-httphandler';

import { ManagementRoutingModule } from './management-routing.module';
import { NgAuthGuard, NgAuthInterceptor, NgAuthModule } from 'projects/ng-auth/src/public-api';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { Page3Component } from './pages/page3/page3.component';
import { LoginedLayoutComponent } from './components/logined-layout/logined-layout.component';
import { UserService } from './services/user.service';

@NgModule({
  entryComponents: [],
  declarations: [
    LoginedLayoutComponent,
    Page1Component,
    Page2Component,
    Page3Component
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgAuthModule
  ],
  providers: [
    NgHttphandlerService,
    NgAuthGuard,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NgAuthInterceptor,
      multi: true
    }
  ]
})
export class ManagementModule { }

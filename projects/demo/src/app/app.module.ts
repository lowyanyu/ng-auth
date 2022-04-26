import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgAuthModule, NgAuthService } from 'projects/ng-auth/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    ForbiddenComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgAuthModule
  ],
  providers: [
    NgAuthService,
    {
      provide: 'BASE_URL',
      useValue: 'http://localhost:3000'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

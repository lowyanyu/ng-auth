import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [LoginComponent],
  providers: [
    LoginService
  ]
})
export class HomeModule { }

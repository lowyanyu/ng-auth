import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LoginService } from '../services/login.service';
import { NgAuthService } from 'projects/ng-auth/src/public-api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  alertMessage = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder,
    private authService: NgAuthService
  ) {
    this.loginForm = this.fb.group({
      loginAccount: ['', Validators.required],
      loginPwd: ['', Validators.required]
    });

    console.log(this.authService.getPrincipal());
  }

  ngOnInit() { }

  login(loginValue: any): void {
    this.alertMessage = '';
    if (this.loginForm.invalid) {
      return;
    }

    this.loginService.login(loginValue.loginAccount, loginValue.loginPwd).subscribe(
      rtn => {
        console.log('Router,', this.router);
        // this.router.navigate(['/management']);
        this.router.navigateByUrl('/management');
      },
      error => this.alertMessage = '登入失敗'
    );

  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgAuthService } from 'projects/ng-auth/src/public-api';

@Component({
  selector: 'app-logined-layout',
  templateUrl: './logined-layout.component.html',
  styleUrls: ['./logined-layout.component.scss']
})
export class LoginedLayoutComponent implements OnInit {

  userId: number;
  logoutUrl = '';

  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private authService: NgAuthService
  ) {
    console.log(this.authService.getPrincipal());
    this.userId = this.authService.getPrincipal().getProperty('userId');
    this.logoutUrl = `${baseUrl}/rest/management/logout`;
  }

  ngOnInit() { }

  logout(): void {
    this.authService.logout().subscribe(
      logoutSuccess => {
        if (logoutSuccess) {
          this.router.navigate(['/home']);
        }
      }
    );
  }

  logoutByApi(): void {
    this.authService.logout(this.logoutUrl, {account: 'me'}).subscribe(
      data => {
        console.log(data);
        location.href = data.logoutUrl;
      },
      error => {
        alert('Logout failed!!');
      }
    );
  }

}

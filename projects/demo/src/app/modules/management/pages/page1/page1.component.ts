import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {

  userList: any[] | undefined;
  amount: number | undefined;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserPageList(0,0).subscribe(
      (rst: any) => {
        this.userList = rst.result;
        this.amount = rst.amount;
      },
      error => {
        alert('Get User List fail!!');
      }
    );
  }

  getUserPageListFail(): void {
    this.userService.getUserPageListFail(0,0).subscribe(
      (rst: any) => {
        this.userList = rst.result;
        this.amount = rst.amount;
      },
      error => {
        alert('Get User List fail!!');
      }
    );
  }

}

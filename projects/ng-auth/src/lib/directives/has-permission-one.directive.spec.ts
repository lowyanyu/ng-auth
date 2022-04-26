import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HasPermissionOneDirective } from './has-permission-one.directive';
import { NgAuthService } from './../services/ng-auth.service';

@Component({
  template: `
    <div *hasPermissionOne="permission">Has Permission One</div>
  `
})
class TestComponent {
  public permission: any;

  setPermission(p: any) {
    this.permission = p;
  }
}

class MockNgAuthService {
  hasPermissionOne(permission: string[]) {}
}

describe('HasPermissionOneDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let authService: NgAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HasPermissionOneDirective, TestComponent ],
      providers: [
        { provide: NgAuthService, useClass: MockNgAuthService }
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(TestComponent);
    authService = TestBed.inject(NgAuthService);
    component = fixture.componentInstance;
  });

  describe(`"Auth service hasPermissionOne return true" testing`, () => {
    beforeEach(() => {
      spyOn(authService, 'hasPermissionOne').and.returnValue(true);
    });

    it('permission input is undefined', () => {
      fixture.componentInstance.setPermission(undefined);
      fixture.detectChanges();

      expect(authService.hasPermissionOne).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input is empty string', () => {
      fixture.componentInstance.setPermission('');
      fixture.detectChanges();

      expect(authService.hasPermissionOne).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input has value', () => {
      fixture.componentInstance.setPermission('CG_UserSearch,CG_UserNew');
      fixture.detectChanges();

      expect(authService.hasPermissionOne).toHaveBeenCalledWith(['CG_UserSearch','CG_UserNew']);

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeTruthy();
      expect(el.nativeElement.textContent.trim()).toBe('Has Permission One');
    });

    it('permission input is null', () => {
      fixture.componentInstance.setPermission(null);
      fixture.detectChanges();

      expect(authService.hasPermissionOne).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });
  });

  describe(`"Auth service hasPermissionOne return false" testing`, () => {
    beforeEach(() => {
      spyOn(authService, 'hasPermissionOne').and.returnValue(false);
    });

    it('permission input is undefined', () => {
      fixture.componentInstance.setPermission(undefined);
      fixture.detectChanges();

      expect(authService.hasPermissionOne).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input is empty string', () => {
      fixture.componentInstance.setPermission('');
      fixture.detectChanges();

      expect(authService.hasPermissionOne).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input has value', () => {
      fixture.componentInstance.setPermission('CG_UserSearch,CG_UserNew');
      fixture.detectChanges();

      expect(authService.hasPermissionOne).toHaveBeenCalledWith(['CG_UserSearch','CG_UserNew']);

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

  });

});

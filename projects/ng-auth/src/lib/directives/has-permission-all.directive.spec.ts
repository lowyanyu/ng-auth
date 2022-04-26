import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HasPermissionAllDirective } from './has-permission-all.directive';
import { NgAuthService } from './../services/ng-auth.service';

@Component({
  template: `
    <div *hasPermissionAll="permission">Has Permission All</div>
  `
})
class TestComponent {
  public permission: any;

  setPermission(p: any) {
    this.permission = p;
  }
}

class MockNgAuthService {
  hasPermissionAll(permission: string[]) {}
}

describe('HasPermissionAllDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let authService: NgAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HasPermissionAllDirective, TestComponent ],
      providers: [
        { provide: NgAuthService, useClass: MockNgAuthService }
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(TestComponent);
    authService = TestBed.inject(NgAuthService);
    component = fixture.componentInstance;
  });

  describe(`"Auth service hasPermissionAll return true" testing`, () => {
    beforeEach(() => {
      spyOn(authService, 'hasPermissionAll').and.returnValue(true);
    });

    it('permission input is undefined', () => {
      fixture.componentInstance.setPermission(undefined);
      fixture.detectChanges();

      expect(authService.hasPermissionAll).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input is empty string', () => {
      fixture.componentInstance.setPermission('');
      fixture.detectChanges();

      expect(authService.hasPermissionAll).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input has value', () => {
      fixture.componentInstance.setPermission('CG_UserSearch,CG_UserNew');
      fixture.detectChanges();

      expect(authService.hasPermissionAll).toHaveBeenCalledWith(['CG_UserSearch','CG_UserNew']);

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeTruthy();
      expect(el.nativeElement.textContent.trim()).toBe('Has Permission All');
    });

    it('permission input is null', () => {
      fixture.componentInstance.setPermission(null);
      fixture.detectChanges();

      expect(authService.hasPermissionAll).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });
  });

  describe(`"Auth service hasPermissionAll return false" testing`, () => {
    beforeEach(() => {
      spyOn(authService, 'hasPermissionAll').and.returnValue(false);
    });

    it('permission input is undefined', () => {
      fixture.componentInstance.setPermission(undefined);
      fixture.detectChanges();

      expect(authService.hasPermissionAll).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input is empty string', () => {
      expect(authService.hasPermissionAll).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input has value', () => {
      fixture.componentInstance.setPermission('CG_UserSearch,CG_UserNew');
      fixture.detectChanges();

      expect(authService.hasPermissionAll).toHaveBeenCalledWith(['CG_UserSearch','CG_UserNew']);

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input is null', () => {
      fixture.componentInstance.setPermission(null);
      fixture.detectChanges();

      expect(authService.hasPermissionAll).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

  });

});

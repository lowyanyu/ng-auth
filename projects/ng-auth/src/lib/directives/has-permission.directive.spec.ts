import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HasPermissionDirective } from './has-permission.directive';
import { NgAuthService } from '../services/ng-auth.service';

@Component({
  template: `
    <div *hasPermission="permission">Has Permission</div>
  `
})
class TestComponent {
  public permission: any;

  setPermission(p: any) {
    this.permission = p;
  }
}

class MockNgAuthService {
  hasPermission(permission: string) {}
}

describe('HasPermissionDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let authService: NgAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HasPermissionDirective, TestComponent ],
      providers: [
        { provide: NgAuthService, useClass: MockNgAuthService }
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(TestComponent);
    authService = TestBed.inject(NgAuthService);
    component = fixture.componentInstance;
  });

  describe(`"Auth service hasPermission return true" testing`, () => {
    beforeEach(() => {
      spyOn(authService, 'hasPermission').and.returnValue(true);
    });

    it('permission input is undefined', () => {
      fixture.componentInstance.setPermission(undefined);
      fixture.detectChanges();

      expect(authService.hasPermission).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input is empty string', () => {
      fixture.componentInstance.setPermission('');
      fixture.detectChanges();

      expect(authService.hasPermission).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input has value', () => {
      fixture.componentInstance.setPermission('CG_UserSearch');
      fixture.detectChanges();

      expect(authService.hasPermission).toHaveBeenCalledWith('CG_UserSearch');

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeTruthy();
      expect(el.nativeElement.textContent.trim()).toBe('Has Permission');
    });

  });

  describe(`"Auth service hasPermission return false" testing`, () => {
    beforeEach(() => {
      spyOn(authService, 'hasPermission').and.returnValue(false);
    });

    it('permission input is undefined', () => {
      fixture.componentInstance.setPermission(undefined);
      fixture.detectChanges();

      expect(authService.hasPermission).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input is empty string', () => {
      fixture.componentInstance.setPermission('');
      fixture.detectChanges();

      expect(authService.hasPermission).not.toHaveBeenCalled();

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

    it('permission input has value', () => {
      fixture.componentInstance.setPermission('CG_UserSearch');
      fixture.detectChanges();

      expect(authService.hasPermission).toHaveBeenCalledWith('CG_UserSearch');

      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });

  });

});

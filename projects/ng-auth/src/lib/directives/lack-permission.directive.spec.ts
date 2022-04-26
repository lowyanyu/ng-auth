import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LackPermissionDirective } from './lack-permission.directive';
import { NgAuthService } from '../services/ng-auth.service';

@Component({
  template: `
    <div id="block1" *lackPermission>Undefined permission</div>
    <div id="block2" *lackPermission="''">Empty permission</div>
    <div id="block3" *lackPermission="'CG_UserSearch'">Lack Permission</div>
  `
})
class TestComponent {}

class MockNgAuthService {
  lackPermission(permission: string) {}
}

describe('LackPermissionDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let authService: NgAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LackPermissionDirective, TestComponent ],
      providers: [
        { provide: NgAuthService, useClass: MockNgAuthService }
      ]
    })
    .compileComponents()
  });

  describe(`"Auth service lackPermission return true" testing`, () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      authService = TestBed.inject(NgAuthService);
      component = fixture.componentInstance;

      spyOn(authService, 'lackPermission').and.returnValue(true);
      fixture.detectChanges();
    });

    it('permission input is undefined', () => {
      const el = fixture.debugElement.query(By.css('#block1'));
      expect(el).toBeFalsy();
    });

    it('permission input is empty string', () => {
      expect(authService.lackPermission).not.toHaveBeenCalledWith('');

      const el = fixture.debugElement.query(By.css('#block2'));
      expect(el).toBeFalsy();
    });

    it('permission input has value', () => {
      expect(authService.lackPermission).toHaveBeenCalledWith('CG_UserSearch');

      const el = fixture.debugElement.query(By.css('#block3'));
      expect(el).toBeTruthy();
      expect(el.nativeElement.textContent.trim()).toBe('Lack Permission');
    });
  });

  describe(`"Auth service lackPermission return false" testing`, () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      authService = TestBed.inject(NgAuthService);
      component = fixture.componentInstance;

      spyOn(authService, 'lackPermission').and.returnValue(false);
      fixture.detectChanges();
    });

    it('permission input is undefined', () => {
      const el = fixture.debugElement.query(By.css('#block1'));
      expect(el).toBeFalsy();
    });

    it('permission input is empty string', () => {
      expect(authService.lackPermission).not.toHaveBeenCalledWith('');

      const el = fixture.debugElement.query(By.css('#block2'));
      expect(el).toBeFalsy();
    });

    it('permission input has value', () => {
      expect(authService.lackPermission).toHaveBeenCalledWith('CG_UserSearch');

      const el = fixture.debugElement.query(By.css('#block3'));
      expect(el).toBeFalsy();
    });

  });

});

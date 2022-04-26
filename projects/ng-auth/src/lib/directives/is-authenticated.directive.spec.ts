import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IsAuthenticatedDirective } from './is-authenticated.directive';
import { NgAuthService } from '../services/ng-auth.service';

@Component({
  template: `<div *isAuthenticated>Is Authenticated</div>`
})
class TestComponent {}

class MockNgAuthService {
  isAuthenticated() {}
}

describe('IsAuthenticatedDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let authService: NgAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsAuthenticatedDirective, TestComponent ],
      providers: [
        { provide: NgAuthService, useClass: MockNgAuthService }
      ]
    })
    .compileComponents()
  });

  describe(`"Auth service isAuthenticated return true" testing`, () => {
    beforeEach(() => {
      authService = TestBed.inject(NgAuthService);
      spyOn(authService, 'isAuthenticated').and.returnValue(true);
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show text', () => {
      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeTruthy();
      expect(el.nativeElement.textContent.trim()).toBe('Is Authenticated');
    });
  });

  describe(`"Auth service isAuthenticated return false" testing`, () => {
    beforeEach(() => {
      authService = TestBed.inject(NgAuthService);
      spyOn(authService, 'isAuthenticated').and.returnValue(false);
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not show text', () => {
      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeFalsy();
    });
  });

});

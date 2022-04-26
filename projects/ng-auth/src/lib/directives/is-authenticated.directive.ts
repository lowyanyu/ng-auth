import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { NgAuthService } from '../services/ng-auth.service';

@Directive({
  selector: '[isAuthenticated]'
})
export class IsAuthenticatedDirective {

  constructor(
    private authService: NgAuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    if (this.authService.isAuthenticated()) {
      // 新增 DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // 移除 DOM
      this.viewContainer.clear();
    }
  }
}

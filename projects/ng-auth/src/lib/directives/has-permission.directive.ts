import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { NgAuthService } from '../services/ng-auth.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective {

  constructor(
    private authService: NgAuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set hasPermission(permission: string) {
    if (permission === undefined || permission === '') {
      this.viewContainer.clear();
    } else {
      if (this.authService.hasPermission(permission)) {
        // 新增 DOM
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // 移除 DOM
        this.viewContainer.clear();
      }
    }
  }

}

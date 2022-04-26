import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { NgAuthService } from '../services/ng-auth.service';

@Directive({
  selector: '[hasPermissionOne]'
})
export class HasPermissionOneDirective {

  constructor(
    private authService: NgAuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set hasPermissionOne(permission: string) {
    if (permission === undefined || permission === '') {
      this.viewContainer.clear();
    } else {
      let arrayPermission;
      try {
        arrayPermission = permission.split(',');
      } catch (e) {}
      if (arrayPermission !== undefined && arrayPermission.length > 0) {
        if (this.authService.hasPermissionOne(arrayPermission)) {
          // 新增 DOM
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          // 移除 DOM
          this.viewContainer.clear();
        }
      } else {
        this.viewContainer.clear();
      }
    }
  }

}

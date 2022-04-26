import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { NgAuthService } from '../services/ng-auth.service';

@Directive({
  selector: '[hasPermissionAll]'
})
export class HasPermissionAllDirective {

  constructor(
    private authService: NgAuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set hasPermissionAll(permission: string) {
    if (permission === undefined || permission === '') {
      this.viewContainer.clear();
    } else {
      let arrayPermission;
      try {
        arrayPermission = permission.split(',');
      } catch (e) {}
      if (arrayPermission !== undefined && arrayPermission.length > 0) {
        if (this.authService.hasPermissionAll(arrayPermission)) {
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



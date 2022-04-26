import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHttphandlerService } from '@cg/ng-httphandler';

import { HasPermissionAllDirective } from './directives/has-permission-all.directive';
import { HasPermissionOneDirective } from './directives/has-permission-one.directive';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { LackPermissionAllDirective } from './directives/lack-permission-all.directive';
import { LackPermissionOneDirective } from './directives/lack-permission-one.directive';
import { LackPermissionDirective } from './directives/lack-permission.directive';
import { IsAuthenticatedDirective } from './directives/is-authenticated.directive';

const permissionDir = [
  HasPermissionDirective,
  HasPermissionAllDirective,
  HasPermissionOneDirective,
  LackPermissionDirective,
  LackPermissionAllDirective,
  LackPermissionOneDirective
];

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [...permissionDir, IsAuthenticatedDirective],
  declarations: [...permissionDir, IsAuthenticatedDirective],
  providers: [
    NgHttphandlerService
  ]
})
export class NgAuthModule {
}

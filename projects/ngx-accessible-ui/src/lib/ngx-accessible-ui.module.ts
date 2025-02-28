import { NgModule } from '@angular/core';
import { AccessibleMenuDirective } from './accessible-menu.directive';
import { AccessibleNavigationDirective } from './accessible-navigation.directive';

@NgModule({
  declarations: [AccessibleMenuDirective, AccessibleNavigationDirective],
  exports: [AccessibleMenuDirective, AccessibleNavigationDirective],
})
export class NgxAccessibleUiModule {}

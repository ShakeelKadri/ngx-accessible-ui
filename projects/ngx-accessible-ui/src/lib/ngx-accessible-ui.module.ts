import { NgModule } from '@angular/core';
import { AccessibleMenuDirective } from './accessible-menu.directive';
import { AccessibleNavigationDirective } from './accessible-navigation.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AccessibleMenuDirective, AccessibleNavigationDirective],
  imports: [
    CommonModule,
  ],
  exports: [
    AccessibleMenuDirective,
    AccessibleNavigationDirective    
  ]
})
export class NgxAccessibleUiModule { }


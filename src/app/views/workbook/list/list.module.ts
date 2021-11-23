import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkbookListComponent } from './list.component';
import { WorkbookListRoutingModule } from './list-routing.module';


@NgModule({
  declarations: [
    WorkbookListComponent
  ],
  imports: [
    CommonModule,
    WorkbookListRoutingModule,
  ]
})
export class WorkbookListModule { }

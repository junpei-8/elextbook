import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkbookListComponent } from './list.component';
import { WorkbookListRoutingModule } from './list-routing.module';
import { MlButtonModule } from '@material-lite/angular/button';


@NgModule({
  declarations: [
    WorkbookListComponent
  ],
  imports: [
    CommonModule,
    MlButtonModule,
    WorkbookListRoutingModule,
  ]
})
export class WorkbookListModule { }

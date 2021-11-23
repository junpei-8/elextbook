import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkbookGameComponent } from './game.component';
import { WorkbookGameRoutingModule } from './game-routing.module';


@NgModule({
  declarations: [
    WorkbookGameComponent
  ],
  imports: [
    CommonModule,
    WorkbookGameRoutingModule
  ]
})
export class WorkbookGameModule { }

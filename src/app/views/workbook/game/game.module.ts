import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkbookGameComponent } from './game.component';
import { WorkbookGameRoutingModule } from './game-routing.module';
import { MlButtonModule } from '@material-lite/angular/button';
import { MlRippleModule } from '@material-lite/angular/core';
import { InsertContentDirective } from './insert-content.directive';
import { RoundPipe } from './round.pipe';


@NgModule({
  declarations: [
    WorkbookGameComponent,
    InsertContentDirective,
    RoundPipe
  ],
  imports: [
    CommonModule,
    MlRippleModule,
    MlButtonModule,
    WorkbookGameRoutingModule
  ]
})
export class WorkbookGameModule { }

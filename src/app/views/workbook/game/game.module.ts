import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkbookGameComponent } from './game.component';
import { WorkbookGameRoutingModule } from './game-routing.module';
import { MlButtonModule } from '@material-lite/angular/button';
import { MlRippleModule } from '@material-lite/angular/core';
import { RoundPipe } from './round.pipe';
import { AnswersRendererDirective } from './answers-renderer.directive';
import { QuestionRendererDirective } from './question-renderer.directive';


@NgModule({
  declarations: [
    WorkbookGameComponent,
    AnswersRendererDirective,
    QuestionRendererDirective,
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

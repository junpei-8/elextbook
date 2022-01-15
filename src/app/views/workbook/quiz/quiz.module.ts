import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkbookQuizComponent } from './quiz.component';
import { WorkbookQuizRoutingModule } from './quiz-routing.module';
import { MlButtonModule } from '@material-lite/angular/button';
import { MlRippleModule } from '@material-lite/angular/core';
import { RoundPipe } from './round.pipe';
import { AnswersRendererDirective } from './answers-renderer.directive';
import { QuestionRendererDirective } from './question-renderer.directive';


@NgModule({
  declarations: [
    WorkbookQuizComponent,
    AnswersRendererDirective,
    QuestionRendererDirective,
    RoundPipe
  ],
  imports: [
    CommonModule,
    MlRippleModule,
    MlButtonModule,
    WorkbookQuizRoutingModule
  ]
})
export class WorkbookQuizModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkbookQuizComponent } from './quiz.component';

const routes: Routes = [
  { path: '', component: WorkbookQuizComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkbookQuizRoutingModule { }

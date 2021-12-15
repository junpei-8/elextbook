import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MlButtonModule } from '@material-lite/angular/button';

import { SignInUrgingComponent } from './sign-in-urging.component';

@NgModule({
  declarations: [
    SignInUrgingComponent
  ],
  imports: [
    CommonModule,
    MlButtonModule,
    RouterModule
  ],
  exports: [
    SignInUrgingComponent
  ],
})
export class SignInUrgingModule { }

import { NgModule } from '@angular/core';
import { MlButtonModule } from '@material-lite/angular/button';

import { SignInUrgingComponent } from './sign-in-urging.component';

@NgModule({
  declarations: [
    SignInUrgingComponent
  ],
  imports: [
    MlButtonModule
  ],
  exports: [
    SignInUrgingComponent
  ],
})
export class SignInUrgingModule { }

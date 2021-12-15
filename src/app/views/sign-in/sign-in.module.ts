import { NgModule } from '@angular/core';

import { SignInRoutingModule } from './sign-in-routing.module';
import { SignInComponent } from './sign-in.component';
import { MlButtonModule } from '@material-lite/angular/button';


@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    SignInRoutingModule,
    MlButtonModule
  ]
})
export class SignInModule { }

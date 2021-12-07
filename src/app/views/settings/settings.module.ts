import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MlSlideToggleModule } from '@material-lite/angular/slide-toggle';
import { MlButtonModule } from '@material-lite/angular/button';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MlButtonModule,
    MlSlideToggleModule
  ]
})
export class SettingsModule { }

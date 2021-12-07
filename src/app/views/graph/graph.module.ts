import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphRoutingModule } from './graph-routing.module';
import { GraphComponent } from './graph.component';
import { MlButtonModule } from '@material-lite/angular/button';


@NgModule({
  declarations: [
    GraphComponent
  ],
  imports: [
    CommonModule,
    MlButtonModule,
    GraphRoutingModule
  ]
})
export class GraphModule { }

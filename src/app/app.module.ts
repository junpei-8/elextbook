import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MlButtonModule } from '@material-lite/angular/button';
import { MlRippleModule  } from '@material-lite/angular/core';
import { MlPortalModule } from '@material-lite/angular-cdk/portal';
import { MlStraightTrackerModule } from '@material-lite/angular-cdk/straight-tracker';

import { NotFoundComponent } from './views/not-found/not-found.component';
import { HomeComponent } from './views/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MlRippleModule,
    MlButtonModule,
    MlPortalModule,
    MlStraightTrackerModule,
    // TemplateRefsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

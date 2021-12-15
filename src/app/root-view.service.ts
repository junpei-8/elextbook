import { Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RootRouteKeys } from './app-routing.module';

@Injectable({
  providedIn: 'root'
})
export class RootView {
  loadedRoute: { [name in RootRouteKeys]?: boolean } = {
    home: true,
  }

  mobileNavHasHidden: boolean;

  routerOutlet: RouterOutlet;

  constructor() {}
}

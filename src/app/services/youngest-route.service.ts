import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RouteData } from '../app-routing.module';
import { RouteChanges, ROUTE_CHANGES } from './route-changes.service';

export interface YoungestRouteSnapshot extends ActivatedRouteSnapshot {
  data: RouteData;
}

@Injectable({
  providedIn: 'root'
})
export class YoungestRoute {
  readonly activatedRouteRef: ActivatedRoute;
  readonly snapshot: YoungestRouteSnapshot;

  constructor(
    activatedRoute: ActivatedRoute,
    @Inject(ROUTE_CHANGES) routeChanges: RouteChanges
  ) {
    routeChanges.subscribe(() => {
      console.log(activatedRoute.snapshot, 'test')
      let route = activatedRoute;

      while (route.firstChild) {
        route = route.firstChild;
      }

      // @ts-ignore
      this.activatedRouteRef = route;

      // @ts-ignore
      this.snapshot = route.snapshot;
    });
  }
}

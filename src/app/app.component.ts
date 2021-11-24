import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MediaQuery } from './services/media-query.service';

import { RootRouteNames, RouteData } from './app-routing.module';
import { RouteChanges, ROUTE_CHANGES } from './services/route-changes.service';
import { YoungestRoute, YOUNGEST_ROUTE } from './services/youngest-route.service';
import { Meta } from './services/meta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Elextbook';

  private _doCheckCount = 0;

  mediaQueryState: {
    isPC: boolean;
    headerLeftButtonVariant: 'icon' | 'basic';
    navTrackerPosition: 'after' | 'before';
    navTrackerOrientation: 'vertical' | 'horizontal';
  } = {} as any;

  selectedRoute: { [route in RootRouteNames]?: 'primary' } = {};
  selectedRouteIndex: number | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    mediaQuery: MediaQuery,
    meta: Meta,
    @Inject(ROUTE_CHANGES) routeChanges: RouteChanges,
    @Inject(YOUNGEST_ROUTE) youngestRoute: YoungestRoute,
  ) {
    routeChanges.subscribe(() => {
      const data = youngestRoute.ref.snapshot.data as RouteData;

      meta.update(data);
      const rootData = data.root;
      if (rootData) {
        this.selectedRouteIndex = rootData.index;
        this.selectedRoute = {
          [rootData.key]: 'primary'
        };

      } else {
        this.selectedRouteIndex = void 0;
        this.selectedRoute = {}
      }
    });

    mediaQuery.pcChanges.subscribe(isPC => {
      if (isPC) {
        this.mediaQueryState = {
          isPC: true,
          headerLeftButtonVariant: 'basic',
          navTrackerPosition: 'after',
          navTrackerOrientation: 'vertical'
        };

      } else {
        this.mediaQueryState = {
          isPC: false,
          headerLeftButtonVariant: 'icon',
          navTrackerPosition: 'before',
          navTrackerOrientation: 'horizontal'
        };
      }

      changeDetector.markForCheck(); // 初回ロード時に発火するが、レンダリング回数に影響しないことを検証済み
    });
  }

  ngDoCheck(): void {
    this._doCheckCount++;
    console.log('Do Check', this._doCheckCount);
  }
}

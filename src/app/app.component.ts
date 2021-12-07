import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MediaQuery } from './services/media-query.service';

import { RootRouteNames, RouteData } from './app-routing.module';
import { RouteChanges, ROUTE_CHANGES } from './services/route-changes.service';
import { YoungestRoute, YOUNGEST_ROUTE } from './services/youngest-route.service';
import { Meta } from './services/meta.service';
import { FIREBASE, Firebase } from './services/firebase';
import { animate, query, sequence, style, transition, trigger } from '@angular/animations';
import { RootDrawer } from './root-drawer.service';
import { RootChangeDetector } from './root-change-detector';
import { RootHeader } from './root-header.service';
import { MlPortalConfig } from '@material-lite/angular-cdk/portal';
import { DOCUMENT } from '@angular/common';
import { RootView } from './root-view.service';

@Component({
  selector: 'eb-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('rootRouteAnimations', [
      transition('* => *',
        sequence([
          style({ pointerEvents: 'none' }),

          query(':enter',
            style({ position: 'absolute', opacity: 0, willChange: 'all' })
          , { optional: true }),

          query(':leave', [
            style({ opacity: 1, willChange: 'all' }),
            animate('120ms cubic-bezier(0.56, 0, 0.56, 0.2)', style({ opacity: 0 })),
          ], { optional: true }),

          query(':leave', animate('8ms', style({ position: 'absolute' })), { optional: true }),

          query(':enter', [
            style({ position: 'relative' }),
            animate('120ms cubic-bezier(0.24, 0.8, 0.24, 1)', style({ opacity: 1 }))
          ], { optional: true })
        ])
      )
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('rhDefaultContent', { static: true })
  set onSetRootHeaderDefaultContent(ref: TemplateRef<HTMLElement>) {
    this.rootHeader.defaultContent = ref;
  }

  @ViewChild('rdRef')
  set onSetRootDrawerRef(ref: ElementRef<HTMLElement>) {
    this.rootDrawer.elementRef = ref;
  }

  title = 'Elextbook';

  private _doCheckCount = 0;

  mediaQueryState: {
    isPC: boolean;
    headerLeftButtonVariant: 'icon' | 'basic';
    navTrackerPosition: 'after' | 'before';
    navTrackerOrientation: 'vertical' | 'horizontal';
  } = {} as any;

  selectedRouteKey: string;

  selectedRoute: { [route in RootRouteNames]?: 'primary' } = {};
  selectedRouteIndex: number | undefined;

  headerPortalConfig: MlPortalConfig = {
    animation: {
      enter: 240,
      leave: 240,
      className: 'rh-content'
    }
  };

  constructor(
    changeDetector: ChangeDetectorRef,
    mediaQuery: MediaQuery,
    meta: Meta,
    ngZone: NgZone,
    public rootDrawer: RootDrawer,
    public rootHeader: RootHeader,
    public rootView: RootView,
    // private _firebase: Firebase,
    @Inject(FIREBASE) private _firebase: Firebase,
    @Inject(ROUTE_CHANGES) routeChanges: RouteChanges,
    @Inject(YOUNGEST_ROUTE) youngestRoute: YoungestRoute,
    @Inject(DOCUMENT) private _document: Document
  ) {
    RootChangeDetector.ref = changeDetector;

    routeChanges.subscribe(() => {
      ngZone.runOutsideAngular(() => setTimeout(() => window.scrollTo({ top: 0 }), 120));

      const data = youngestRoute.ref.snapshot.data as RouteData;

      meta.update(data);
      this.selectedRouteKey = data.key;

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

  ngOnInit(): void {
    this.rootHeader.updateContents();
  }

  ngDoCheck(): void {
    this._doCheckCount++;
    console.log('Do Check', this._doCheckCount);
  }

  ngAfterViewInit(): void {
    // Import google analytics
    this._firebase.analytics;
  }

  toggleDarkTheme(): void {
    this._document.body.classList.toggle('dark-theme');
    const x = document.createElement('path');
  }

  routeNavigation(event: Event, path: string): void {
  }
}

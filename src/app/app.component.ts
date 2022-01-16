import {
  animate,
  animateChild,
  query,
  sequence,
  style,
  transition,
  trigger
  } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
  } from '@angular/core';
import { MlPortalConfig } from '@material-lite/angular-cdk/portal';
import { RootRouteKeys, RootRouteNames, RouteData } from './app-routing.module';
import { LOADED_ROUTE } from './loaded-route';
import { RootChangeDetector } from './root-change-detector';
import { RootDrawer } from './root-drawer.service';
import { RootHeader } from './root-header.service';
import { ROOT_VIEW } from './root-view';
import { FIREBASE, Firebase } from './services/firebase';
import { MediaQuery } from './services/media-query.service';
import { Meta } from './services/meta.service';
import { ROUTE_CHANGES, RouteChanges } from './services/route-changes.service';



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
            animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 0 })) // 減速
            // animate('120ms cubic-bezier(0.4, 0, 1, 1)', style({ opacity: 0 })) // 加速
          ], { optional: true }),

          query(':leave', animate('16ms', style({ position: 'absolute' })), { optional: true }),

          query(':enter', [
            style({ position: 'relative' }),
            animate('120ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 })) // 標準
          ], { optional: true }),

          animateChild(),
        ])
      )
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Elextbook';


  @ViewChild('rhDefaultContent', { static: true })
  set onSetRootHeaderDefaultContent(ref: TemplateRef<HTMLElement>) {
    this.rootHeader.defaultContent = ref;
  }

  @ViewChild('rdRef')
  set onSetRootDrawerRef(ref: ElementRef<HTMLElement>) {
    this.rootDrawer.elementRef = ref;
  }


  selectedRouteKey: RootRouteKeys;

  selectedRoute: { [route in RootRouteNames]?: 'primary' } = {};
  selectedRouteIndex: number | undefined;


  loadedRoute = LOADED_ROUTE;
  rootView = ROOT_VIEW;


  mediaQueryState: {
    isPC: boolean;
    headerLeftButtonVariant: 'icon' | 'basic';
    navTrackerPosition: 'after' | 'before';
    navTrackerOrientation: 'vertical' | 'horizontal';
  } = {} as any;


  headerPortalConfig: MlPortalConfig = {
    animation: {
      enter: 240,
      leave: 240,
      className: 'rh-content'
    }
  };


  private _doCheckCount = 0;


  constructor(
    changeDetector: ChangeDetectorRef,
    mediaQuery: MediaQuery,
    meta: Meta,
    ngZone: NgZone,
    public rootDrawer: RootDrawer,
    public rootHeader: RootHeader,
    // private _firebase: Firebase,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(FIREBASE) private _firebase: Firebase,
    @Inject(ROUTE_CHANGES) routeChanges: RouteChanges<RouteData>
  ) {
    RootChangeDetector.ref = changeDetector;


    routeChanges.subscribe((youngestRoute) => {
      ngZone.runOutsideAngular(() => setTimeout(() => window.scrollTo({ top: 0 }), 120));

      const data = youngestRoute.snapshot.data;

      const rootData = data.root;
      meta.update(data);
      this.selectedRouteKey = data.key;

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


  routeNavigation(event: Event, path: string): void {
  }
}

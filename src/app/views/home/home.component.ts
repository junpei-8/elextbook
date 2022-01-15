import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { RootHeader } from 'src/app/root-header.service';
import { Fragment } from 'src/app/services/fragment.service';
import { PWA } from 'src/app/services/pwa.service';

@Component({
  selector: 'eb-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'eb-view' }
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(
    rootHeader: RootHeader,
    changeDetectorRef: ChangeDetectorRef,
    public fragment: Fragment,
    public pwa: PWA,
  ) {
    rootHeader.setup();

    pwa.addA2hsEventListener(() => changeDetectorRef.markForCheck());
  }


  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
  }


  onLoadImage(event: Event): void {
    (event.target as Element).classList.add('loaded');
  }
}

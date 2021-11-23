import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Fragment } from 'src/app/services/fragment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'eb-view' }
})
export class HomeComponent implements OnInit {

  constructor(
    public fragment: Fragment
  ) { }

  ngOnInit(): void {
  }

  onLoadImage(event: Event): void {
    (event.target as Element).classList.add('loaded');
  }
}

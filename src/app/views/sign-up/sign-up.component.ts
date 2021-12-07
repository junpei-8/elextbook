import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootHeader } from 'src/app/root-header.service';

@Component({
  selector: 'eb-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'eb-view' }
})
export class SignUpComponent implements OnInit {

  constructor(
    rootHeader: RootHeader
  ) {
    rootHeader.setup();
  }

  ngOnInit(): void {
  }

}

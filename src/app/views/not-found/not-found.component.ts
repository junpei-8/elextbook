import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RootHeader } from 'src/app/root-header.service';

@Component({
  selector: 'eb-not-found',
  templateUrl: './not-found.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'eb-view eb-emoticon' }
})
export class NotFoundComponent {
  constructor(
    rootHeader: RootHeader
  ) {
    rootHeader.setup();
  }
}

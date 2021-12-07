import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootHeader } from 'src/app/root-header.service';

@Component({
  selector: 'eb-library',
  templateUrl: './library.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'eb-view eb-view-spacer' }
})
export class LibraryComponent implements OnInit {

  constructor(
    rootHeader: RootHeader
  ) {
    rootHeader.setup();
  }

  ngOnInit(): void {
  }

}

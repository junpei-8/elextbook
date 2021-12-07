import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootHeader } from 'src/app/root-header.service';

@Component({
  selector: 'eb-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'st eb-view eb-limit eb-view-spacer' }
})
export class SettingsComponent implements OnInit {

  constructor(
    _rootHeader: RootHeader,
  ) {
    _rootHeader.setup();
  }

  ngOnInit(): void {
  }

}

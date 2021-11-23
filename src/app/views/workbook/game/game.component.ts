import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-workbook-game',
  templateUrl: './game.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'eb-view' }
})
export class WorkbookGameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}

import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'eb-sign-in-urging',
  templateUrl: 'sign-in-urging.component.html',
  styleUrls: ['sign-in-urging.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInUrgingComponent implements OnInit {
  constructor() { }
  ngOnInit() { }
}

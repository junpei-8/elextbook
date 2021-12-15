import { Attribute, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'eb-sign-in-urging',
  templateUrl: 'sign-in-urging.component.html',
  styleUrls: ['sign-in-urging.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'siu',
  },
})
export class SignInUrgingComponent {
  constructor(
    @Attribute('d') public d: string,
  ) {}
}

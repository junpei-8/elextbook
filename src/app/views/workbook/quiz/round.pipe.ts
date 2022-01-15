import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {
  transform(value: number): number | '-' {
    return value
      ? Math.round(value * 1000) / 10
      : value === 0
        ? 0
        : '-';
  }
}

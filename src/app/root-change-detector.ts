import { ChangeDetectorRef } from '@angular/core';


export interface RootChangeDetector {
  ref: ChangeDetectorRef;
}
export const RootChangeDetector: RootChangeDetector = { ref: null! };

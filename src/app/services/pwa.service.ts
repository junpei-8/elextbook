
import { Injectable } from '@angular/core';

interface A2hsEvent extends Event {
  prompt: () => void;
  userChoice: Promise<any>;
}

@Injectable({
  providedIn: 'root'
})
export class PWA {
  isEnabled: boolean;
  hasSupported: boolean;

  a2hsHasSupported: boolean;
  a2hsEvent?: A2hsEvent;

  constructor() {
    const windowRef = window as Window & typeof globalThis & { onbeforeinstallprompt?: null };
    const navigator = windowRef.navigator as Navigator & { standalone?: boolean };

    const isEnabled = this.isEnabled =
      !!navigator.standalone || windowRef.matchMedia('(display-mode: standalone)').matches;

    this.hasSupported = isEnabled || !!windowRef.ServiceWorker;

    if (this.a2hsHasSupported = (windowRef.onbeforeinstallprompt === null)) {
      windowRef.addEventListener('beforeinstallprompt',
        (event: any) => this.a2hsEvent = event, { once: true });
    }
  }

  addA2hsEventListener(callback: (event: A2hsEvent) => any): void {
    if (this.a2hsHasSupported && !this.a2hsEvent) {
      window.addEventListener('beforeinstallprompt', callback as any, { once: true });
    }
  }
}

import { Injectable } from '@angular/core';
import { IndexedDB } from 'src/app/services/indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class WorkbookDownloader {
  constructor(
    private _IDB: IndexedDB
  ) { }

  download(): void {
  }
}

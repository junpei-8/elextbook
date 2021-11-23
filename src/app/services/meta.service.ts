import { Injectable } from '@angular/core';
import { Meta as MetaService, Title } from '@angular/platform-browser';

export interface MetaData {
  title?: string;
  desc?: string;
  noIndex?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Meta {
  constructor(
    private _title: Title,
    private _meta: MetaService,
  ) {}

  update(metaData: MetaData): void {
    const meta = this._meta;

    if (metaData.desc)
      meta.updateTag({ name: 'description', content: metaData.desc });

    if (metaData.noIndex)
      meta.updateTag({ name: 'robots', content: 'noindex' });

    const title = metaData.title;
    this._title.setTitle(
      title
        ? title + ' | Elextbook'
        : 'Elextbook'
    );
  }
}

export const IndexedDB: {
  hasSupported: boolean;
  request: IDBOpenDBRequest
} = {} as any

const IDB = window.indexedDB;
const hasSupported = IndexedDB.hasSupported = !!IDB;
if (hasSupported) {
  IndexedDB.request = IDB.open('elextbook');
}

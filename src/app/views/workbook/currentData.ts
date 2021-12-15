import { WorkbookData } from './types';

interface CurrentData {
  ref: WorkbookData | null | undefined
};
export let WORKBOOK_CURRENT_DATA: CurrentData = {
  ref: null
};

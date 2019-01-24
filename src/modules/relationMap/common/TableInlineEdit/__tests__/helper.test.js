import {
  orderColumnFields,
  orderItemColumnFields,
  batchColumnFields,
  shipmentColumnFields,
} from 'modules/tableTemplate/constants';
import { getExportRows } from '../helpers';
import info from './data.json';
import editData from './editData.json';
import mappingObjects from './mappingObj.json';

describe('export helper function', () => {
  test('getExportRows', () => {
    getExportRows({
      data: { editData, mappingObjects },
      ids: info.ids,
      columns: {
        ...info.columns,
        orderColumnFieldsFilter: orderColumnFields,
        orderItemColumnFieldsFilter: orderItemColumnFields,
        batchColumnFieldsFilter: batchColumnFields,
        shipmentColumnFieldsFilter: shipmentColumnFields,
      },
    });
  });
});

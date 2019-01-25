import {
  orderColumnFields,
  orderItemColumnFields,
  batchColumnFields,
  shipmentColumnFields,
} from 'modules/tableTemplate/constants';
import { getExportRows, getExportColumns } from '../helpers';
import info from './data.json';
import editData from './editData.json';
import mappingObjects from './mappingObj.json';

describe('export helper function', () => {
  test('getExportRows', () => {
    const rows = getExportRows({
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
    expect(rows.length).toEqual(6);
    rows.forEach(row => {
      expect(row.length).toEqual(79);
    });
  });

  test('getExportColumns', () => {
    const intl = {
      formatMessage: jest.fn(d => d.name),
    };
    const columns = getExportColumns(intl, {
      ...info.columns,
      orderColumnFieldsFilter: orderColumnFields,
      orderItemColumnFieldsFilter: orderItemColumnFields,
      batchColumnFieldsFilter: batchColumnFields,
      shipmentColumnFieldsFilter: shipmentColumnFields,
    });
    expect(columns.length).toEqual(79);
  });
});

// @flow
import { OrderSheetColumnGroupTypes } from 'modules/order/sheet/columns';
import { ShipmentSheetColumnGroupTypes } from 'modules/shipment/sheet/columns';
import { BatchSheetColumnGroupTypes } from 'modules/batch/sheet/columns';

export const getColumnGroupTypes = (type: string): Array<string> => {
  if (type === 'OrderSheet') {
    return OrderSheetColumnGroupTypes;
  }
  if (type === 'ShipmentSheet') {
    return ShipmentSheetColumnGroupTypes;
  }
  if (type === 'BatchSheet') {
    return BatchSheetColumnGroupTypes;
  }
  return [];
};

export default getColumnGroupTypes;

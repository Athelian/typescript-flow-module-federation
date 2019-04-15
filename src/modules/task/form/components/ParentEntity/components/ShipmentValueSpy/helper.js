// @flow
import { getByPath } from 'utils/fp';
import { getLatestDate } from 'utils/shipment';

export const getValueBy = (field: string, values: Object) => {
  if (field.toLowerCase().includes('date')) {
    return getByPath(field, values);
  }
  return getLatestDate(getByPath(field, values));
};

export default getValueBy;

// @flow
import format from 'date-fns/format';

export const formatToDateInput = (date: string): string => format(date, 'yyyy-MM-dd');

export const formatToDateTimeGraphql = (date: string): string =>
  format(date, "yyyy-MM-dd'T'HH:mm:ssZ");

export default formatToDateInput;

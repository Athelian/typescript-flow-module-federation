// @flow
import format from 'date-fns/format';

export const formatToDateInput = (date: Date): string => format(date, 'yyyy-MM-dd');

export const formatToDateTimeGraphql = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ssZ");

export default formatToDateInput;

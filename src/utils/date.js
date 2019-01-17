// @flow
import format from 'date-fns/format';

export const formatToDateInput = (date: string): string => format(date, 'yyyy-MM-dd');

export const formatToDateTimeInput = (time: string): string => format(time, "yyyy-MM-dd'T'hh:mm");

export const formatToDateTimeDisplay = (time: string): string => format(time, 'yyyy/MM/dd hh:mm');

export const formatToDateTimeGraphql = (date: string): string =>
  format(date, "yyyy-MM-dd'T'HH:mm:ssZ");

export default formatToDateInput;

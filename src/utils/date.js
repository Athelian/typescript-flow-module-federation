// @flow
import format from 'date-fns/format';

export const formatToDateInput = (date: string): string => format(new Date(date), 'yyyy-MM-dd');

export const formatToDateTimeInput = (time: string): string =>
  format(new Date(time), "yyyy-MM-dd'T'HH:mm");

export const formatToDateTimeGraphql = (date: string): string =>
  format(new Date(date), "yyyy-MM-dd'T'HH:mm:ssZ");

export const formatToDateLabel = (date: string): string => format(new Date(date), 'dd/MM/yyyy');

export default formatToDateInput;

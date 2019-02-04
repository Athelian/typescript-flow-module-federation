// @flow
import { format, min, max } from 'date-fns';

export { min as earliest, max as latest };

export const formatToDateInput = (date: string): string => format(new Date(date), 'yyyy-MM-dd');

export const formatToDateTimeInput = (time: string): string =>
  format(new Date(time), "yyyy-MM-dd'T'HH:mm");

export const formatToDateTimeGraphql = (date: string): string =>
  format(new Date(date), "yyyy-MM-dd'T'HH:mm:ssZ");

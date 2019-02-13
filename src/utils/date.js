// @flow
import { format, min, max, startOfDay, endOfDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export { min as earliest, max as latest };

export const formatToDateInput = (date: string): string => format(new Date(date), 'yyyy-MM-dd');

export const formatToDateTimeInput = (time: string): string =>
  format(new Date(time), "yyyy-MM-dd'T'HH:mm");

export const formatToDateLabel = (date: string): string => format(new Date(date), 'dd/MM/yyyy');
const timeZone = 'Europe/London';

export const formatFromDate = (date: string): Date =>
  zonedTimeToUtc(startOfDay(new Date(date)), timeZone);
export const formatEndDate = (date: string): Date =>
  zonedTimeToUtc(endOfDay(new Date(date)), timeZone);

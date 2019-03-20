// @flow
import { format, min, max, startOfDay, endOfDay, isValid } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export { min as earliest, max as latest };

export const formatToDateInput = (date: string): string =>
  isValid(new Date(date)) ? format(new Date(date), 'yyyy-MM-dd') : '';

export const formatToGraphql = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm:ssZ");

export const formatToDateTimeInput = (time: string): string =>
  format(new Date(time), "yyyy-MM-dd'T'HH:mm");

export const formatToDateLabel = (date: string): string => format(new Date(date), 'dd/MM/yyyy');
// We need to convert to UTC timezone for backend
const utcTimeZone = 'UTC';
export const formatFromDate = (date: string): Date =>
  zonedTimeToUtc(startOfDay(new Date(date)), utcTimeZone);
export const formatEndDate = (date: string): Date =>
  zonedTimeToUtc(endOfDay(new Date(date)), utcTimeZone);

export const startOfToday = (): Date => zonedTimeToUtc(startOfDay(new Date()), utcTimeZone);

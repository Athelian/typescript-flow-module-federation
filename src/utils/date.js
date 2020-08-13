// @flow
import {
  format,
  min,
  max,
  startOfDay,
  endOfDay,
  isValid,
  isBefore,
  isAfter,
  differenceInCalendarDays,
  differenceInMinutes,
  addDays,
  addWeeks,
  addMonths,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import moment from 'moment';

export {
  min as earliest,
  max as latest,
  isBefore,
  isAfter,
  differenceInCalendarDays,
  differenceInMinutes,
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  format,
  isValid,
};

export const isValidDate = (date: any): boolean => !!date && isValid(new Date(date));

export const isDateObject = (date: any): boolean => date instanceof Date;

// ex. (2020-01-01T11:01:00Z) => 2020-01-01T11:01:00
// When send in UTC datetime,
// it will NOT convert and simply return the datetime with no Z suffix
export const removeZSuffix = (date: ?string): string | null => {
  if (date && date.charAt(date.length - 1) === 'Z') {
    return date.substring(0, date.length - 1);
  }

  return null;
};

// ex. (+09:00) => -09:00
// When send in timezone,
// it will switch the sign prefix
export const switchTimezoneSign = (timezone: string): string => {
  if (timezone.charAt(0) === '-') {
    return `+${timezone.substring(1)}`;
  }

  return `-${timezone.substring(1)}`;
};

// ex. (2020-01-01T11:01+09:00) => 2020-01-01T11:01
// When send in datetime with timezone suffix,
// it will NOT convert and simply return the datetime with no timezone suffix
export const removeTimezone = (date: ?string): string => {
  if (date) {
    const result = date.substring(0, 16);

    return result;
  }

  return '';
};

// ex. (2020-01-01T11:01, +09:00) => 2020-01-01T11:01+09:00
// When send in datetime value and timezone,
// it will NOT convert and simply return the datetime with timezone suffix
export const addTimezone = (date: ?string, timezone: string): string => {
  if (date) {
    const result = date.concat(timezone);

    return result;
  }

  return '';
};

export const formatDateInputToDateObjectWithTimezone = (
  date: ?string,
  timezone: string
): Date | null =>
  !!date && isValidDate(date)
    ? zonedTimeToUtc(
        new Date(
          parseInt(date.substring(0, 4), 10),
          parseInt(date.substring(5, 7), 10) - 1,
          parseInt(date.substring(8, 10), 10)
        ),
        timezone
      )
    : null;

// ex. (2020-01-01T11:01, +09:00) => 2020-01-01T02:01+09:00
// When send in value from datetime input and user's timezone,
// it will convert the value based on the timezone and return with timezone suffix
export const formatDatetimeInputToDatetimeWithTimezone = (
  date: ?string,
  timezone: string
): string | null => {
  if (date) {
    const dateObj = moment.utc(date.concat(timezone));

    const result = dateObj.format(`YYYY-MM-DDTHH:mm${timezone}`);

    return result;
  }

  return null;
};

// ex. (2020-01-01T11:01:00Z, +09:00) => 2020-01-01T02:01+09:00
// When send in UTC value and user's timezone,
// it will convert the value based on the timezone and return with timezone suffix
export const formatUTCDatetimeToDatetimeWithTimezone = (
  date: ?string,
  timezone: string
): string | null => {
  if (date) {
    const dateObj = moment.utc(removeZSuffix(date).concat(switchTimezoneSign(timezone)));

    const result = dateObj.format(`YYYY-MM-DDTHH:mm${timezone}`);

    return result;
  }

  return null;
};

// ex. (2020-01-01T11:01+09:00) => 2020-01-01T02:01:00Z
// When send in datetime with timezone suffix,
// it will convert the value based on the timezone suffix and return in UTC
export const formatDatetimeWithTimezoneToUTCDatetime = (date: ?string): string | null => {
  if (date) {
    const dateObj = moment.utc(date);

    const result = dateObj.format('YYYY-MM-DDTHH:mm:ss').concat('Z');

    return result;
  }

  return null;
};

// ex. (2020-01-01T14:01+09:00, +03:00) => 2020-01-01T02:01+03:00
// When send in datetime with timezone suffix and timezone,
// it will convert the datetime to the timezone and return the datetime with timezone suffix
export const formatDatetimeWithTimezoneToDatetimeWithTimezone = (
  date: ?string,
  timezone: string
): string | null => {
  if (date) {
    const result = formatUTCDatetimeToDatetimeWithTimezone(
      formatDatetimeWithTimezoneToUTCDatetime(date),
      timezone
    );

    return result;
  }

  return null;
};

// ex. (2020-01-01T11:01:00Z or 2020-01-01T11:01+09:00, +09:00) => 2020-01-01T02:01+09:00
// When send in either a UTC date or date with timezone suffix,
// it will determine which type was sent and trigger the format function specific to that type
export const formatDatetimeQueryToDatetimeWithTimezone = (
  date: ?string,
  timezone: string
): string | null => {
  if (date) {
    // Date with offset
    if (date.charAt(date.length - 6) === '+' || date.charAt(date.length - 6) === '-') {
      return formatDatetimeWithTimezoneToDatetimeWithTimezone(date, timezone);
    }
    // UTC date with no offset
    return formatUTCDatetimeToDatetimeWithTimezone(date, timezone);
  }

  return null;
};

export const formatDateObjectWithTimezoneForMutation = (date: ?Date): string | null =>
  !!date && isValidDate(date) ? format(date, "yyyy-MM-dd'T'HH:mmxxx") : null;

export const formatToDateInput = (date: string): string =>
  isValid(new Date(date)) ? format(new Date(date), 'yyyy-MM-dd') : '';

export const formatToDateTimeInput = (date: string): string =>
  isValid(new Date(date))
    ? format(
        new Date(
          parseInt(date.substring(0, 4), 10),
          parseInt(date.substring(5, 7), 10) - 1,
          parseInt(date.substring(8, 10), 10),
          parseInt(date.substring(11, 13), 10),
          parseInt(date.substring(14, 16), 10)
        ),
        "yyyy-MM-dd'T'HH:mm"
      )
    : '';

export const formatDatetimeForMutation = (date: string): string => {
  return format(
    new Date(
      parseInt(date.substring(0, 4), 10),
      parseInt(date.substring(5, 7), 10) - 1,
      parseInt(date.substring(8, 10), 10),
      parseInt(date.substring(11, 13), 10),
      parseInt(date.substring(14, 16), 10)
    ),
    "yyyy-MM-dd'T'HH:mm:'00Z'"
  );
};

export const formatDateToGraphql = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");

export const formatToDateLabel = (date: string): string => format(new Date(date), 'dd/MM/yyyy');
// We need to convert to UTC timezone for backend
const utcTimeZone = 'UTC';
export const formatFromDate = (date: string): Date =>
  zonedTimeToUtc(startOfDay(new Date(date)), utcTimeZone);
export const formatEndDate = (date: string): Date =>
  zonedTimeToUtc(endOfDay(new Date(date)), utcTimeZone);

export const startOfToday = (): Date => zonedTimeToUtc(startOfDay(new Date()), utcTimeZone);

export const todayForDateInput = (): string =>
  formatToDateInput(zonedTimeToUtc(startOfDay(new Date()), utcTimeZone));

// --- date binding utils ---
const DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z";
export const calculateDate = ({
  date: selectedDate,
  duration,
  offset = 0,
}: {
  date: ?Date | ?string,
  duration: 'days' | 'weeks' | 'months',
  offset: number,
}) => {
  if (!selectedDate) return null;

  const date = new Date(selectedDate);

  if (!isValid(date)) {
    return null;
  }

  switch (duration) {
    case 'weeks':
      return format(startOfDay(addWeeks(date, offset)), DATE_FORMAT);

    case 'months':
      return format(startOfDay(addMonths(date, offset)), DATE_FORMAT);

    default:
      return format(startOfDay(addDays(date, offset)), DATE_FORMAT);
  }
};

export const findDuration = ({
  months,
  weeks,
}: {
  months: number,
  weeks: number,
}): 'days' | 'weeks' | 'months' => {
  let duration = 'days';
  if (Math.abs(months) > 0) {
    duration = 'months';
  } else if (Math.abs(weeks) > 0) {
    duration = 'weeks';
  }
  return duration;
};

export const calculateNewDate = ({
  date,
  dateInterval,
}: {
  date: ?string,
  dateInterval?: Object,
}) => {
  const { months, weeks, days } = dateInterval || {};
  return calculateDate({
    date,
    duration: findDuration({ months, weeks }),
    offset: months || weeks || days,
  });
};

export const calculateDueDate = (freeTimeStartDate: string, freeTimeDuration: number = 0) =>
  addDays(new Date(freeTimeStartDate), freeTimeDuration);

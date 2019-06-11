// @flow
import { type IntlShape } from 'react-intl';
import { addWeeks, addMonths, addDays, startOfDay, format, isValid } from 'date-fns';
import logger from 'utils/logger';
import { orderBinding, orderItemBinding, batchBinding, shipmentBinding } from './constants';

const DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssz";

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
    logger.warn('invalid date', date, selectedDate);
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

export const convertBindingToSelection = (
  bindingValue: ?{ months: number, weeks: number, days: number }
) => {
  if (bindingValue && bindingValue.months) {
    if (bindingValue.months >= 0) {
      return {
        autoDateDuration: { value: bindingValue.months, metric: 'months' },
        autoDateOffset: 'after',
      };
    }
    return {
      autoDateDuration: { value: bindingValue.months, metric: 'months' },
      autoDateOffset: 'before',
    };
  }

  if (bindingValue && bindingValue.weeks) {
    if (bindingValue.weeks >= 0) {
      return {
        autoDateDuration: { value: bindingValue.weeks, metric: 'weeks' },
        autoDateOffset: 'after',
      };
    }
    return {
      autoDateDuration: { value: bindingValue.weeks, metric: 'weeks' },
      autoDateOffset: 'before',
    };
  }

  if (bindingValue && bindingValue.days) {
    if (bindingValue.days >= 0) {
      return {
        autoDateDuration: { value: bindingValue.days, metric: 'days' },
        autoDateOffset: 'after',
      };
    }
    return {
      autoDateDuration: { value: bindingValue.days, metric: 'days' },
      autoDateOffset: 'before',
    };
  }

  return {
    autoDateDuration: { value: 0, metric: 'days' },
    autoDateOffset: 'after',
  };
};

export const getFieldsByEntity = (type: string, intl: IntlShape) => {
  switch (type) {
    case 'Shipment':
      return (Object.values(shipmentBinding(intl)): any).map(
        ({ field: value, description: label }) => ({
          value,
          label,
        })
      );
    case 'Batch':
      return (Object.values(batchBinding(intl)): any).map(
        ({ field: value, description: label }) => ({
          value,
          label,
        })
      );

    case 'OrderItem':
      return (Object.values(orderItemBinding(intl)): any).map(
        ({ field: value, description: label }) => ({
          value,
          label,
        })
      );

    default:
      return (Object.values(orderBinding(intl)): any).map(
        ({ field: value, description: label }) => ({
          value,
          label,
        })
      );
  }
};

export const findDuration = ({ months, weeks }: { months: number, weeks: number }) => {
  let duration = 'days';
  if (months > 0) {
    duration = 'months';
  } else if (weeks > 0) {
    duration = 'weeks';
  }
  return duration;
};

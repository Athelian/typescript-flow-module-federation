// @flow
import { type IntlShape } from 'react-intl';
import { addWeeks, subWeeks, addMonths, subMonths, addDays, subDays } from 'date-fns';
import { orderBinding, batchBinding, shipmentBinding } from './constants';

export const calculateDate = ({
  date,
  duration,
  offset,
}: {
  date: Date,
  duration: 'day' | 'week' | 'month',
  offset: number,
}) => {
  switch (duration) {
    case 'week':
      return offset >= 0 ? addWeeks(date, offset) : subWeeks(date, offset);

    case 'month':
      return offset >= 0 ? addMonths(date, offset) : subMonths(date, offset);

    default:
      return offset >= 0 ? addDays(date, offset) : subDays(date, offset);
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

    default:
      return (Object.values(orderBinding(intl)): any).map(
        ({ field: value, description: label }) => ({
          value,
          label,
        })
      );
  }
};

// @flow
import { type IntlShape } from 'react-intl';
import { addWeeks, addMonths, addDays } from 'date-fns';
import { formatToGraphql } from 'utils/date';
import { orderBinding, batchBinding, shipmentBinding } from './constants';

export const calculateDate = ({
  date: selectedDate,
  duration,
  offset,
}: {
  date: ?Date,
  duration: 'days' | 'weeks' | 'months',
  offset: number,
}) => {
  if (!selectedDate) return null;

  const date = new Date(selectedDate);

  switch (duration) {
    case 'weeks':
      return formatToGraphql(addWeeks(date, offset));

    case 'months':
      return formatToGraphql(addMonths(date, offset));

    default:
      return formatToGraphql(addDays(date, offset));
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

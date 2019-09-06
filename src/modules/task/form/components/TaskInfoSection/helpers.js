// @flow
import { type IntlShape } from 'react-intl';
import { orderBinding, orderItemBinding, batchBinding, shipmentBinding } from './constants';

export const convertBindingToSelection = (
  bindingValue: ?{ months: number, weeks: number, days: number }
) => {
  if (bindingValue && bindingValue.months) {
    if (bindingValue.months > 0) {
      return {
        autoDateDuration: { value: bindingValue.months, metric: 'months' },
      };
    }
    return {
      autoDateDuration: { value: bindingValue.months, metric: 'months' },
    };
  }

  if (bindingValue && bindingValue.weeks) {
    if (bindingValue.weeks > 0) {
      return {
        autoDateDuration: { value: bindingValue.weeks, metric: 'weeks' },
      };
    }
    return {
      autoDateDuration: { value: bindingValue.weeks, metric: 'weeks' },
    };
  }

  if (bindingValue && bindingValue.days) {
    if (bindingValue.days > 0) {
      return {
        autoDateDuration: { value: bindingValue.days, metric: 'days' },
      };
    }
    return {
      autoDateDuration: { value: bindingValue.days, metric: 'days' },
    };
  }

  return {
    autoDateDuration: { value: 0, metric: 'days' },
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
    case 'Order':
      return (Object.values(orderBinding(intl)): any).map(
        ({ field: value, description: label }) => ({
          value,
          label,
        })
      );

    default:
      return [];
  }
};

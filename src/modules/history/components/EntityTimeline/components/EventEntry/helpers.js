// @flow
import * as React from 'react';
import { isDataType, getByPath } from 'utils/fp';
import { uniq } from 'lodash';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import type { Event } from 'modules/history/components/EntityTimeline/type.js.flow';

type Props = {
  value: any,
};

const dateReg = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
const numberReg = /^\d+$/;

export const FormatValue = ({ value }: Props) => {
  if (value) {
    if (isDataType(String, value)) {
      if (dateReg.test(value)) {
        return <FormattedDate value={value} />;
      }
      if (numberReg.test(value)) {
        return <FormattedNumber value={value} />;
      }

      return value;
    }

    if (isDataType(Number, value)) {
      return <FormattedNumber value={value} />;
    }

    if (isDataType(Object, value)) {
      if (Object.keys(value).length === 1 && value.metric) return value.metric;
      if (Object.keys(value).length === 2 && value.value)
        return (
          <>
            <FormattedNumber value={value.value} /> {value.metric}
          </>
        );
      if (Object.keys(value).length === 3 && value.length && value.width && value.height)
        return (
          <>
            <FormattedNumber value={value.length.value || 0} />
            {value.length.metric}x<FormattedNumber value={value.width.value || 0} />
            {value.width.metric}x<FormattedNumber value={value.height.value || 0} />
            {value.height.metric}
          </>
        );
      return JSON.stringify(value);
    }
  }

  return 'N/A';
};

export const findTargetChanges = (type: string, event: Event) => {
  const result = [];
  if (event.adds && event.adds.length) {
    event.adds.forEach(({ entity }) => {
      const target = getByPath('__typename', entity);
      switch (target) {
        case 'Batch':
          result.push(`${target}: ${getByPath('no', entity)}`);
          break;
        case 'OrderItem':
          result.push(`${target}: ${getByPath('productProvider.product.name', entity)}`);
          break;

        default:
          result.push(target);
          break;
      }
    });
  }
  if (event.updates && event.updates.length) {
    event.updates.forEach(({ entity }) => {
      const target = getByPath('__typename', entity);
      switch (target) {
        case 'Batch':
          result.push(`${target}: ${getByPath('no', entity)}`);
          break;

        case 'OrderItem':
          result.push(`${target}: ${getByPath('productProvider.product.name', entity)}`);
          break;

        default:
          result.push(target);
          break;
      }
    });
  }
  if (event.removes && event.removes.length) {
    event.removes.forEach(({ entity }) => {
      const target = getByPath('__typename', entity);
      switch (target) {
        case 'Batch':
          result.push(`${target}: ${getByPath('no', entity)}`);
          break;

        case 'OrderItem':
          result.push(`${target}: ${getByPath('productProvider.product.name', entity)}`);
          break;

        default:
          result.push(target);
          break;
      }
    });
  }
  return uniq(result).join(',');
};

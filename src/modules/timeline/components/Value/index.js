// @flow
import * as React from 'react';
import { FormattedDate } from 'react-intl';
import { getByPath } from 'utils/fp';
import { ValueStyle } from './style';

type WrapperProps = {
  children: React.Node,
};

export const ValueWrapper = ({ children }: WrapperProps) => (
  <span className={ValueStyle}>{children}</span>
);

type Props = {
  value: any,
};

const FormattedValue = ({ value }: Props) => {
  if (!value) {
    return null;
  }

  switch (getByPath('__typename', value)) {
    case 'StringValue':
      return value.string;
    case 'IntValue':
      return value.int;
    case 'FloatValue':
      return value.float;
    case 'BooleanValue':
      return value.boolean ? 'true' : 'false';
    case 'DateTimeValue':
      return <FormattedDate value={new Date(value.datetime)} />;
    case 'MetricValueValue':
      return `${value.metricValue.value} ${value.metricValue.metric}`;
    case 'SizeValue':
      return `(${value.size.length.value} ${value.size.length.metric} x ${value.size.width.value} ${value.size.width.metric} x ${value.size.height.value} ${value.size.height.metric})`;
    case 'Values':
      return value.values
        .map(val => FormattedValue({ value: val }))
        .filter(Boolean)
        .join(', ');
    case 'EntityValue':
      return value?.entity?.name || '';
    default:
      return null;
  }
};

export const Value = ({ value }: Props) => (
  <ValueWrapper>
    <FormattedValue value={value} />
  </ValueWrapper>
);

export default Value;

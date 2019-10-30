// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import DisplayWrapper from '../DisplayWrapper';
import { MetricValueStyle } from './style';

type Props = {
  value: {
    value: number,
    metric: string,
  },
};

const MetricValueDisplay = ({ value: { value, metric } }: Props) => (
  <DisplayWrapper>
    <span className={MetricValueStyle}>
      <FormattedNumber value={value} />
      <span>{metric}</span>
    </span>
  </DisplayWrapper>
);

export default MetricValueDisplay;

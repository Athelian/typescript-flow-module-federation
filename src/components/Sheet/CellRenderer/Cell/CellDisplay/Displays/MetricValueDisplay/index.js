// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import DisplayWrapper from '../DisplayWrapper';

type Props = {
  value: {
    value: number,
    metric: string,
  },
};

const MetricValueDisplay = ({ value: { value, metric } }: Props) => {
  return (
    <DisplayWrapper>
      <FormattedNumber value={value} />
      {metric}
    </DisplayWrapper>
  );
};

export default MetricValueDisplay;

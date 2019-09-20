// @flow
import * as React from 'react';
import { DefaultStyle, Label, MetricInput } from 'components/Form';

type Props = {
  value: { min: number | null, max: number | null, metric: string },
  readonly: boolean,
  onChange: boolean => void,
};

const MetricRange = (metrics: Array<string>) => ({ value, readonly, onChange }: Props) => {
  return (
    <>
      <Label height="30px">From</Label>
      <DefaultStyle>
        <MetricInput
          value={{ value: value.min, metric: value.metric }}
          metrics={metrics}
          onChange={e => {
            onChange({
              ...value,
              min: e.target?.value.value ?? null,
              metric: e.target?.value.metric ?? value.metric,
            });
          }}
          readOnly={readonly}
        />
      </DefaultStyle>

      <Label height="30px">To</Label>
      <DefaultStyle>
        <MetricInput
          value={{ value: value.max, metric: value.metric }}
          metrics={metrics}
          onChange={e => {
            onChange({
              ...value,
              max: e.target?.value.value ?? null,
              metric: e.target?.value.metric ?? value.metric,
            });
          }}
          readOnly={readonly}
        />
      </DefaultStyle>
    </>
  );
};

export default MetricRange;

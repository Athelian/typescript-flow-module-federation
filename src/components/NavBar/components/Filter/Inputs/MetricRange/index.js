// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DefaultStyle, Label, MetricInput } from 'components/Form';
import { volumeMetrics, areaMetrics, distanceMetrics, weightMetrics } from 'utils/metric';
import type { FilterInputProps } from '../../types';
import messages from '../../messages';

const MetricRange = (metrics: Array<string>) => ({
  value,
  readonly,
  onChange,
}: FilterInputProps<{ min: number | null, max: number | null, metric: string }>) => {
  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.from} />
      </Label>
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
          valueReadOnly={readonly}
          metricReadOnly={readonly}
        />
      </DefaultStyle>

      <Label height="30px">
        <FormattedMessage {...messages.to} />
      </Label>
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
          valueReadOnly={readonly}
          metricReadOnly={readonly}
        />
      </DefaultStyle>
    </>
  );
};

export const VolumeRange = MetricRange(volumeMetrics);
export const AreaRange = MetricRange(areaMetrics);
export const LengthRange = MetricRange(distanceMetrics);
export const MassRange = MetricRange(weightMetrics);

export default MetricRange;

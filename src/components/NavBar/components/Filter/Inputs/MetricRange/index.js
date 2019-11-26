// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, MetricInput } from 'components/Form';
import { volumeMetrics, areaMetrics, distanceMetrics, weightMetrics } from 'utils/metric';
import type { FilterInputProps } from '../../types';
import messages from '../../messages';

const MetricRange = (metrics: Array<string>) => ({
  value,
  readonly,
  onChange,
}: FilterInputProps<{ min: number | null, max: number | null, metric: string }>) => (
  <>
    <Label height="30px">
      <FormattedMessage {...messages.from} />
    </Label>
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

    <Label height="30px">
      <FormattedMessage {...messages.to} />
    </Label>
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
  </>
);

export const VolumeRange = MetricRange(volumeMetrics);
export const AreaRange = MetricRange(areaMetrics);
export const LengthRange = MetricRange(distanceMetrics);
export const MassRange = MetricRange(weightMetrics);

export default MetricRange;

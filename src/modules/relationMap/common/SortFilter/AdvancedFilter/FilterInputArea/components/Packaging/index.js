// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import NumberRangeWithMetricInput from './components/NumberRangeWithMetricInput';
import {
  PackagingWrapperStyle,
  LabelsWrapperStyle,
  MetricInputsBodyWrapperStyle,
  MetricInputsWrapperStyle,
} from './style';
import messages from '../messages';

export default function Packaging() {
  return (
    <div className={PackagingWrapperStyle}>
      <div className={LabelsWrapperStyle}>
        <Label>
          <FormattedMessage {...messages.min} />
        </Label>
        <Label>
          <FormattedMessage {...messages.max} />
        </Label>
        <Label>
          <FormattedMessage {...messages.metric} />
        </Label>
      </div>

      <div className={MetricInputsBodyWrapperStyle}>
        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageLength} />
          </Label>
          <NumberRangeWithMetricInput metrics={['cm', 'm']} metric="m" />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageWidth} />
          </Label>
          <NumberRangeWithMetricInput metrics={['cm', 'm']} metric="m" />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageHeight} />
          </Label>
          <NumberRangeWithMetricInput metrics={['cm', 'm']} metric="m" />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageVolume} />
          </Label>
          <NumberRangeWithMetricInput metrics={['cm³', 'm³']} metric="m³" />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageWeight} />
          </Label>
          <NumberRangeWithMetricInput metrics={['g', 'kg', 'ton']} metric="kg" />
        </div>
      </div>
    </div>
  );
}

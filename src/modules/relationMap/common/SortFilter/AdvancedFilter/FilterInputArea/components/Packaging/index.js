// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import MetricRangeInput from '../MetricRangeInput';
import {
  PackagingWrapperStyle,
  LabelsWrapperStyle,
  MetricInputsBodyWrapperStyle,
  MetricInputsWrapperStyle,
} from './style';
import messages from '../messages';

type OptionalProps = {
  packageLength?: Object,
  packageWidth?: Object,
  packageHeight?: Object,
  packageVolume?: Object,
  packageWeight?: Object,
};

type Props = OptionalProps & {
  onChangePackageLength: Function,
  onChangePackageWidth: Function,
  onChangePackageHeight: Function,
  onChangePackageVolume: Function,
  onChangePackageWeight: Function,
};

export default function Packaging({
  packageLength,
  packageWidth,
  packageHeight,
  packageVolume,
  packageWeight,
  onChangePackageLength,
  onChangePackageWidth,
  onChangePackageHeight,
  onChangePackageVolume,
  onChangePackageWeight,
}: Props) {
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
          <MetricRangeInput
            metrics={['cm', 'm']}
            metric="cm"
            min={packageLength && packageLength.min}
            max={packageLength && packageLength.max}
            onChange={length => onChangePackageLength(length)}
          />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageWidth} />
          </Label>
          <MetricRangeInput
            metrics={['cm', 'm']}
            metric="cm"
            min={packageWidth && packageWidth.min}
            max={packageWidth && packageWidth.max}
            onChange={width => onChangePackageWidth(width)}
          />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageHeight} />
          </Label>
          <MetricRangeInput
            metrics={['cm', 'm']}
            metric="cm"
            min={packageHeight && packageHeight.min}
            max={packageHeight && packageHeight.max}
            onChange={height => onChangePackageHeight(height)}
          />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageVolume} />
          </Label>
          <MetricRangeInput
            metrics={['cm³', 'm³']}
            metric="m³"
            min={packageVolume && packageVolume.min}
            max={packageVolume && packageVolume.max}
            onChange={volume => onChangePackageVolume(volume)}
          />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.packageWeight} />
          </Label>
          <MetricRangeInput
            metrics={['g', 'kg', 'ton']}
            metric="kg"
            min={packageWeight && packageWeight.min}
            max={packageWeight && packageWeight.max}
            onChange={weight => onChangePackageWeight(weight)}
          />
        </div>
      </div>
    </div>
  );
}

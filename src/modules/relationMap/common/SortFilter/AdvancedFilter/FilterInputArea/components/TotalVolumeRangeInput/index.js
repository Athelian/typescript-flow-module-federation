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
} from '../Packaging/style';

type OptionalProps = {
  value: {
    min?: number,
    max?: number,
    metric: string,
  },
};

type Props = OptionalProps & {
  onChange: Function,
};

const defaultProps = {
  value: {
    metric: 'm³',
  },
};

function TotalVolumeRangeInput({ value, onChange }: Props) {
  return (
    <div className={PackagingWrapperStyle}>
      <div className={LabelsWrapperStyle}>
        <Label>
          <FormattedMessage id="modules.relationMap.min" defaultMessage="MIN" />
        </Label>
        <Label>
          <FormattedMessage id="modules.relationMap.max" defaultMessage="MAX" />
        </Label>
        <Label>
          <FormattedMessage id="modules.relationMap.metric" defaultMessage="METRIC" />
        </Label>
      </div>
      <div className={MetricInputsBodyWrapperStyle}>
        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage id="modules.relationMap.totalVolume" defaultMessage="TOTAL VOLUME" />
          </Label>
          {/* $FlowFixMe This comment suppresses an error found when upgrading
           * Flow to v0.112.0. To view the error, delete this comment and run
           * Flow. */}
          <MetricRangeInput metrics={['cm³', 'm³']} onChange={onChange} {...value} />
        </div>
      </div>
    </div>
  );
}

TotalVolumeRangeInput.defaultProps = defaultProps;

export default TotalVolumeRangeInput;

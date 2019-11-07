// @flow
import * as React from 'react';
import type { MetricValue } from 'types';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import ComputableInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/ComputableInput';
import MetricValueInput from '../MetricValueInput';

const MetricValueToggleInput = (input: (InputProps<MetricValue>) => React.Node) => (
  inputProps: InputProps<{ value: ?MetricValue, auto: boolean }, MetricValue>
) => <ComputableInput input={input} {...inputProps} />;

export default {
  Volume: MetricValueToggleInput(MetricValueInput.Volume),
  Area: MetricValueToggleInput(MetricValueInput.Area),
  Length: MetricValueToggleInput(MetricValueInput.Length),
  Mass: MetricValueToggleInput(MetricValueInput.Mass),
};

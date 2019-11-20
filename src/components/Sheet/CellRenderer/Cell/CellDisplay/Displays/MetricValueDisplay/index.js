// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import FormattedNumber from 'components/FormattedNumber';
import type { MetricValue } from 'types';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import { MetricValueStyle } from './style';

const MetricValueDisplay = ({ value: { value, metric } }: DisplayProps<MetricValue>) => (
  <div className={CellDisplayWrapperStyle}>
    <span className={cx(DisplayContentStyle, MetricValueStyle)}>
      <FormattedNumber value={value} />
      <span>{metric}</span>
    </span>
  </div>
);

export default MetricValueDisplay;

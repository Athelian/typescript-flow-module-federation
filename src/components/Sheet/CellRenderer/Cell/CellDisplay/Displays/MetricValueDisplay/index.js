// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import type { MetricValue } from 'types';
import FormattedNumber from 'components/FormattedNumber';
import Tooltip from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/Tooltip';
import type {
  DisplayProps,
  TooltipProps,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import { MetricValueStyle } from './style';

const MetricValueDisplay = ({
  value: { value, metric },
  extra,
}: DisplayProps<MetricValue, { tooltip?: TooltipProps } | null>) => (
  <div className={CellDisplayWrapperStyle}>
    <span className={cx(DisplayContentStyle, MetricValueStyle)}>
      <FormattedNumber value={value} />
      <span>{metric}</span>
    </span>
    {extra?.tooltip && <Tooltip {...extra.tooltip} />}
  </div>
);

export default MetricValueDisplay;

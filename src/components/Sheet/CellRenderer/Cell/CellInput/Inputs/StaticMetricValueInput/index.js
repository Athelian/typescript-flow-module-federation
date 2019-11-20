// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Inputs/NumberInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import type { MetricValue } from 'types';

const StaticMetricValueInput = ({
  value: metricValue,
  onChange,
  readonly,
}: InputProps<MetricValue>) => {
  const { value = 0, metric = '' } = metricValue || {};
  return (
    <div className={CellInputWrapperStyle}>
      <BaseNumberInput
        className={InputStyle}
        value={value === null ? '' : value}
        required
        onChange={e =>
          onChange({
            value: e.target.value,
            metric,
          })
        }
        disabled={readonly}
      />
      <div className={CellDisplayWrapperStyle}>
        <span className={DisplayContentStyle}>{metric}</span>
      </div>
    </div>
  );
};

export default StaticMetricValueInput;

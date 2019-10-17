// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Form/Inputs/NumberInput';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';

const StaticMetricValueInput = ({
  value: metricValue,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<{ value: number, metric: string }>) => {
  const { value = 0, metric = '' } = metricValue || {};
  return (
    <InputWrapper focus={focus} preselect>
      {({ ref }) => (
        <>
          <BaseNumberInput
            inputRef={ref}
            value={value}
            name="value"
            tabIndex="-1"
            nullable={false}
            readOnly={readonly}
            readOnlyHeight="30px"
            onChange={e => {
              onChange({
                value: e.target.value,
                metric,
              });
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          <DisplayWrapper>{metric}</DisplayWrapper>
        </>
      )}
    </InputWrapper>
  );
};

export default StaticMetricValueInput;

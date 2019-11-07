// @flow
import * as React from 'react';
import BaseDateTimeInput from 'components/Form/Inputs/DateTimeInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const DatetimeInput = ({ value, onChange, readonly }: InputProps<Date | string>) => (
  <div className={CellInputWrapperStyle}>
    <BaseDateTimeInput
      className={InputStyle}
      value={value}
      name="value"
      readOnly={readonly}
      readOnlyWidth="100%"
      readOnlyHeight="30px"
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default DatetimeInput;

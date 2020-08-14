// @flow
import * as React from 'react';
import useUser from 'hooks/useUser';
import { formatDatetimeQueryToDatetimeWithTimezone, addTimezone } from 'utils/date';
import BaseDateTimeInput from 'components/Form/Inputs/DateTimeInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const DatetimeInput = ({ value, onChange, readonly }: InputProps<string>) => {
  const { user } = useUser();

  return (
    <div className={CellInputWrapperStyle}>
      <BaseDateTimeInput
        className={InputStyle}
        value={formatDatetimeQueryToDatetimeWithTimezone(value, user.timezone)}
        name="value"
        readOnly={readonly}
        readOnlyWidth="100%"
        readOnlyHeight="30px"
        onChange={e => onChange(addTimezone(e.target.value, user.timezone))}
      />
    </div>
  );
};

export default DatetimeInput;

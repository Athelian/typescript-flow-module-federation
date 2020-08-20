// @flow
import * as React from 'react';
import useUser from 'hooks/useUser';
import { formatDatetimeQueryToDatetimeWithTimezone, removeTimezone, addTimezone } from 'utils/date';
import BaseDateInput from 'components/Form/Inputs/DateInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const DateInputTZ = ({ value, onChange, readonly }: InputProps<?string>) => {
  const { user } = useUser();

  return (
    <div className={CellInputWrapperStyle}>
      <BaseDateInput
        className={InputStyle}
        value={removeTimezone(
          formatDatetimeQueryToDatetimeWithTimezone(value, user.timezone),
          true
        )}
        readOnly={readonly}
        readOnlyWidth="100%"
        readOnlyHeight="30px"
        onChange={e => onChange(addTimezone(e.target.value, user.timezone, true))}
        handleTimezone
      />
    </div>
  );
};

export default DateInputTZ;

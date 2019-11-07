// @flow
import * as React from 'react';
import BaseDateInput from 'components/Form/Inputs/DateInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import ComputableInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/ComputableInput';
import { InputStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const DateToggleInput = (
  props: InputProps<{ value: ?Date | ?string, auto: boolean }, Date | string>
) => (
  <ComputableInput
    {...props}
    input={({ onChange, readonly, value }: InputProps<Date | string>) => (
      <BaseDateInput
        value={value}
        className={InputStyle}
        readOnly={readonly}
        readOnlyWidth="100%"
        readOnlyHeight="30px"
        onChange={e => onChange(e.target.value)}
      />
    )}
  />
);

export default DateToggleInput;

// @flow
import * as React from 'react';
import useUser from 'hooks/useUser';
import { formatDatetimeQueryToDatetimeWithTimezone, addTimezone } from 'utils/date';
import BaseDateInput from 'components/Form/Inputs/DateInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import ComputableInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/ComputableInput';
import {
  InputStyle,
  AutocalculateInputWrapperStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const DateToggleInputTZ = (props: InputProps<{ value: ?string, auto: boolean }, Date | string>) => {
  const { user } = useUser();

  return (
    <ComputableInput
      {...props}
      input={({ onChange, readonly, value }) => (
        <div className={AutocalculateInputWrapperStyle(readonly || (props?.value?.auto ?? false))}>
          <BaseDateInput
            value={formatDatetimeQueryToDatetimeWithTimezone(value, user.timezone)}
            className={InputStyle}
            readOnly={readonly || (props?.value?.auto ?? false)}
            readOnlyWidth="100%"
            readOnlyHeight="30px"
            onChange={e => onChange(addTimezone(e.target.value, user.timezone, true))}
          />
        </div>
      )}
    />
  );
};

export default DateToggleInputTZ;

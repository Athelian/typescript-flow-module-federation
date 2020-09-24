// @flow
import * as React from 'react';
import UserAvatar from 'components/UserAvatar';
import BaseDateInput from 'components/Form/Inputs/DateInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import useUser from 'hooks/useUser';
import { formatDatetimeQueryToDatetimeWithTimezone, removeTimezone, addTimezone } from 'utils/date';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

type StatusDate = { at: string, by: Object };

const StatusDateInputTZ = ({
  value,
  context,
  onChange,
  readonly,
}: InputProps<{ [string]: StatusDate }, string>) => {
  const { user } = useUser();
  const statusDate = value?.[context || ''] ?? { at: null, by: null };

  return (
    <div className={CellInputWrapperStyle}>
      <BaseDateInput
        className={InputStyle}
        value={removeTimezone(
          formatDatetimeQueryToDatetimeWithTimezone(statusDate.at, user.timezone),
          true
        )}
        name="value"
        required
        readOnly={readonly}
        readOnlyWidth="100%"
        readOnlyHeight="30px"
        onChange={evt => {
          const newDate = addTimezone(evt.target.value, user.timezone, true);

          onChange({
            ...(value || {}: any),
            [context || '']: {
              ...statusDate,
              at: newDate,
            },
          });
        }}
      />
      <UserAvatar
        width="20px"
        height="20px"
        firstName={statusDate.by?.firstName}
        lastName={statusDate.by?.lastName}
      />
    </div>
  );
};

export default StatusDateInputTZ;

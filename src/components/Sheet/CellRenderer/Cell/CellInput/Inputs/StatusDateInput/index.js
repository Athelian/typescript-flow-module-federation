// @flow
import * as React from 'react';
import UserAvatar from 'components/UserAvatar';
import BaseDateInput from 'components/Form/Inputs/DateInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

type StatusDate = { at: Date | string, by: Object };

const StatusDateInput = ({
  value,
  context,
  onChange,
  readonly,
}: InputProps<{ [string]: StatusDate }, string>) => {
  const statusDate = value?.[context || ''] ?? { at: null, by: null };

  return (
    <div className={CellInputWrapperStyle}>
      <BaseDateInput
        className={InputStyle}
        value={statusDate.at}
        name="value"
        readOnly={readonly}
        readOnlyWidth="100%"
        readOnlyHeight="30px"
        onChange={e =>
          onChange({
            ...(value || {}: any),
            [context || '']: {
              ...statusDate,
              at: e.target.value,
            },
          })
        }
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

export default StatusDateInput;

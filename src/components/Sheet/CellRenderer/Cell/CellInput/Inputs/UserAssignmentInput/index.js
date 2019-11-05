// @flow
import * as React from 'react';
import { UserAssignmentInput as BaseUserAssignmentInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const UserAssignmentInput = ({
  value,
  context,
  onChange,
  readonly,
}: InputProps<string, Array<string>>) => (
  <div className={CellInputWrapperStyle}>
    <BaseUserAssignmentInput
      users={value || []}
      name="value"
      onChange={(name, users) => onChange(users)}
      editable={!readonly}
      groupIds={context}
      size={20}
    />
  </div>
);

export default UserAssignmentInput;

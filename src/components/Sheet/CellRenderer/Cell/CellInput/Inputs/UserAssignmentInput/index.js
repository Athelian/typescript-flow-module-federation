// @flow
import * as React from 'react';
import { UserAssignmentInput as BaseUserAssignmentInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const UserAssignmentInput = ({
  value,
  context,
  focus,
  onChange,
  readonly,
}: InputProps<string, Array<string>>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className={CellInputWrapperStyle} onBlur={handleBlur}>
      <BaseUserAssignmentInput
        users={value || []}
        name="value"
        onChange={(name, users) => onChange(users, true)}
        editable={!readonly}
        groupIds={context}
        size={20}
      />
    </div>
  );
};

export default UserAssignmentInput;

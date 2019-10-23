// @flow
import * as React from 'react';
import { UserAssignmentInput as BaseUserAssignmentInput } from 'components/Form';
import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';

const UserAssignmentInput = ({
  value,
  extra,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<string, Array<string>>) => (
  <InputWrapper focus={focus}>
    {({ ref }) => (
      <BaseUserAssignmentInput
        users={value || []}
        name="value"
        onChange={(name, users) => onChange(users)}
        editable={!readonly}
        groupIds={extra}
        inputRef={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    )}
  </InputWrapper>
);

export default UserAssignmentInput;

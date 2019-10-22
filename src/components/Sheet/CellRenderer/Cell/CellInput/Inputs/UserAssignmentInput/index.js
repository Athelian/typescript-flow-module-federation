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
}: InputProps<string, { importer: Object, exporter: Object }>) => (
  <InputWrapper focus={focus}>
    {({ ref }) => (
      <BaseUserAssignmentInput
        users={value || []}
        name="value"
        onChange={(name, users) => onChange(users)}
        editable={!readonly}
        groupIds={[extra?.importer?.id, extra?.exporter?.id].filter(Boolean)}
        inputRef={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    )}
  </InputWrapper>
);

export default UserAssignmentInput;

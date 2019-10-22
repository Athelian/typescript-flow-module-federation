// @flow
import * as React from 'react';
import { UserAssignmentInput as BaseUserAssignmentInput } from 'components/Form';
import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';

const UserAssignmentInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
  importer,
  exporter,
}: InputProps<string> & { importer?: Object, exporter?: Object }) => (
  <InputWrapper focus={focus}>
    {({ ref }) => (
      <BaseUserAssignmentInput
        users={value || []}
        name="value"
        onChange={(name, users) => onChange(users)}
        editable={!readonly}
        groupIds={[importer?.id, exporter?.id].filter(Boolean)}
        inputRef={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    )}
  </InputWrapper>
);

export default UserAssignmentInput;

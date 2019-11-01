// @flow
import * as React from 'react';
import type { User } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';
import BaseApprovalInput from './components/BaseApprovalInput';

const ApprovalInput = ({
  value,
  focus,
  readonly,
  onChange,
}: InputProps<{ user: ?User, date: ?(string | Date) }>) => {
  return (
    <InputWrapper focus={focus}>
      {({ ref }) => (
        <BaseApprovalInput
          approved={value}
          onApprove={(user: User) => {
            onChange({ user, date: new Date() });
          }}
          onDisapprove={() => {
            onChange({ user: null, date: null });
          }}
          readonly={readonly}
          inputRef={ref}
        />
      )}
    </InputWrapper>
  );
};
export default ApprovalInput;

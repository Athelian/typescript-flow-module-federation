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
}: InputProps<{ user: ?User, date: ?Date }>) => {
  return (
    <InputWrapper focus={focus}>
      {({ ref }) => (
        <BaseApprovalInput
          approvedAt={value?.date}
          approvedBy={value?.user}
          onApprove={(user: User) => {
            onChange({ user, date: new Date() });
          }}
          onUnapprove={() => {
            onChange({ user: null, date: null });
          }}
          editable={!readonly}
          inputRef={ref}
        />
      )}
    </InputWrapper>
  );
};
export default ApprovalInput;

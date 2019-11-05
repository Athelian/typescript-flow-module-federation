// @flow
import * as React from 'react';
import type { User } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import BaseApprovalInput from './components/BaseApprovalInput';

const ApprovalInput = ({
  value,
  readonly,
  onChange,
}: InputProps<{ user: ?User, date: ?(string | Date) }>) => {
  return (
    <div className={CellInputWrapperStyle}>
      <BaseApprovalInput
        approved={value}
        onApprove={(user: User) => {
          onChange({ user, date: new Date() });
        }}
        onDisapprove={() => {
          onChange({ user: null, date: null });
        }}
        readonly={readonly}
      />
    </div>
  );
};
export default ApprovalInput;

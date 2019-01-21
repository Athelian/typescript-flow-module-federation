// @flow

import React from 'react';
import FormattedName from 'components/FormattedName';
// import FormattedDate from 'components/FormattedDate';

import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import { ApproveButton } from 'components/Buttons';
import { UserConsumer } from 'modules/user';
import {
  ApprovalWrapperStyle,
  ApprovedByWrapperStyle,
  ApprovedByStyle,
  // ApprovedAtStyle,
  UnApproveButtonStyle,
} from './style';

type Props = {
  field: string,
  approvedBy: any,
  setFieldValue: Function,
};

const onApproval = (user: Object, setFieldValue: Function, field: string) =>
  setFieldValue(field, user);

const onUnApproval = (setFieldValue: Function, field: string) => setFieldValue(field, null);

const Approval = ({ approvedBy, setFieldValue, field }: Props) => (
  <div className={ApprovalWrapperStyle}>
    {approvedBy ? (
      <>
        <div className={ApprovedByWrapperStyle}>
          <div className={ApprovedByStyle}>
            <FormattedName firstName={approvedBy.firstName} lastName={approvedBy.lastName} />
          </div>
          {/* <div className={ApprovedAtStyle}>
            <FormattedDate value={approvedAt} />
          </div> */}
        </div>
        <UserAvatar firstName={approvedBy.firstName} lastName={approvedBy.lastName} />
        <button
          data-testid="unApproveButton"
          className={UnApproveButtonStyle}
          onClick={() => onUnApproval(setFieldValue, field)}
          type="button"
        >
          <Icon icon="CLEAR" />
        </button>
      </>
    ) : (
      <UserConsumer>
        {({ user }) => (
          <ApproveButton
            data-testid="approveButton"
            onClick={() => onApproval(user, setFieldValue, field)}
          />
        )}
      </UserConsumer>
    )}
  </div>
);

export default Approval;

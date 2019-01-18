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
  // approvedAt: string,
  approvedBy: any,
  onApproval: Function,
  onUnApproval: Function,
};

const defaultProps = {
  onApproval: () => {},
  onUnApproval: () => {},
};

const Approval = ({ approvedBy, onApproval, onUnApproval }: Props) => (
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
          onClick={onApproval}
          type="button"
        >
          <Icon icon="CLEAR" />
        </button>
      </>
    ) : (
      <UserConsumer>
        {({ user }) => (
          <ApproveButton data-testid="approveButton" onClick={() => onUnApproval(user)} />
        )}
      </UserConsumer>
    )}
  </div>
);

Approval.defaultProps = defaultProps;

export default Approval;

// @flow
import React from 'react';
import FormattedName from 'components/FormattedName';
import FormattedDate from 'components/FormattedDate';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import { ApproveButton } from 'components/Buttons';
import { UserConsumer } from 'modules/user';
import {
  ApprovalWrapperStyle,
  ApprovedByWrapperStyle,
  ApprovedByStyle,
  ApprovedAtStyle,
  UnApproveButtonStyle,
} from './style';

type OptionalProps = {
  approvedBy: Object,
  approvedAt: string,
};

type Props = OptionalProps & {
  approvedByField: string,
  approvedAtField: string,
  setFieldValue: Function,
};

const Approval = ({
  approvedBy,
  approvedAt,
  setFieldValue,
  approvedByField,
  approvedAtField,
}: Props) => (
  <div className={ApprovalWrapperStyle}>
    {approvedBy ? (
      <>
        <div className={ApprovedByWrapperStyle}>
          <div className={ApprovedByStyle}>
            <FormattedName firstName={approvedBy.firstName} lastName={approvedBy.lastName} />
          </div>
          <div className={ApprovedAtStyle}>
            <FormattedDate value={approvedAt} />
          </div>
        </div>
        <UserAvatar firstName={approvedBy.firstName} lastName={approvedBy.lastName} />
        <button
          data-testid="unApproveButton"
          className={UnApproveButtonStyle}
          onClick={() => {
            setFieldValue(approvedByField, null);
            setFieldValue(approvedAtField, null);
          }}
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
            onClick={() => {
              setFieldValue(approvedByField, user);
              setFieldValue(approvedAtField, new Date());
            }}
          />
        )}
      </UserConsumer>
    )}
  </div>
);

export default Approval;

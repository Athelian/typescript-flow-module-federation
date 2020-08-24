// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedName from 'components/FormattedName';
import FormattedDate from 'components/FormattedDate';
import FormattedDateTZ from 'components/FormattedDateTZ';
import { ApproveButton } from 'components/Buttons';
import { type UserAvatarType } from 'types';
import useUser from 'hooks/useUser';
import {
  ApprovalWrapperStyle,
  ApprovedByWrapperStyle,
  ApprovedByStyle,
  ApprovedAtStyle,
  UnapproveButtonStyle,
} from './style';

type OptionalProps = {
  approvedAt: ?(string | Date),
  approvedBy: ?UserAvatarType,
  onApprove: Object => void,
  onUnapprove: () => void,
  editable: boolean,
  name: string,
  handleTimezone: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  approvedAt: null,
  approvedBy: null,
  onApprove: () => {},
  onUnapprove: () => {},
  editable: true,
  name: '',
};

const ApprovalInput = ({
  name,
  approvedAt,
  approvedBy,
  onApprove,
  onUnapprove,
  editable,
  handleTimezone,
}: Props) => {
  const { user } = useUser();

  return (
    <div className={ApprovalWrapperStyle}>
      {approvedAt && approvedBy && (
        <>
          <div className={ApprovedByWrapperStyle}>
            <div className={ApprovedByStyle}>
              <FormattedName firstName={approvedBy.firstName} lastName={approvedBy.lastName} />
            </div>
            <div className={ApprovedAtStyle}>
              {handleTimezone ? (
                <FormattedDateTZ value={approvedAt} user={user} />
              ) : (
                <FormattedDate value={approvedAt} />
              )}
            </div>
          </div>
          <UserAvatar firstName={approvedBy.firstName} lastName={approvedBy.lastName} />
          {editable && (
            <button
              data-testid={`${name}_unApproveButton`}
              className={UnapproveButtonStyle}
              onClick={onUnapprove}
              type="button"
            >
              <Icon icon="CLEAR" />
            </button>
          )}
        </>
      )}
      {editable && (!approvedAt || !approvedBy) && (
        <ApproveButton data-testid={`${name}_approveButton`} onClick={() => onApprove(user)} />
      )}
    </div>
  );
};

ApprovalInput.defaultProps = defaultProps;

export default ApprovalInput;

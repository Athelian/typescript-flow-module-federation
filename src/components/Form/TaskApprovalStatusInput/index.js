// @flow
// FIXME: only use once, should change folder
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import { type UserAvatarType } from 'types';
import { getByPathWithDefault } from 'utils/fp';
import {
  TaskApprovalStatusInputWrapperStyle,
  UserAvatarWrapperStyle,
  DeactivateButtonStyle,
  StatusLabelWrapperStyle,
  StatusLabelStyle,
} from './style';

type OptionalProps = {
  width: string,
  approval?: ?{
    approvedBy: UserAvatarType,
    approvedAt: string,
  },
  rejection?: ?{
    rejectedBy: UserAvatarType,
    rejectedAt: string,
  },
  showUser: boolean,
  onClickUser: () => void,
  showDate: boolean,
  editable: boolean,
};

type Props = OptionalProps & {};

const defaultProps = {
  width: '200px',
  showUser: false,
  onClickUser: () => {},
  showDate: false,
  editable: false,
};

const TaskApprovalStatusInput = ({
  width,
  approval,
  rejection,
  showUser,
  onClickUser,
  showDate,
  editable,
}: Props) => {
  const parsedUser = {
    firstName: approval
      ? getByPathWithDefault('', 'approvedBy.firstName', approval)
      : getByPathWithDefault('', 'rejectedBy.firstName', rejection),
    lastName: approval
      ? getByPathWithDefault('', 'approvedBy.lastName', approval)
      : getByPathWithDefault('', 'rejectedBy.lastName', rejection),
  };
  const parsedDate = approval
    ? getByPathWithDefault('', 'approvedAt', approval)
    : getByPathWithDefault('', 'rejectedAt', rejection);

  return (
    <div className={TaskApprovalStatusInputWrapperStyle(!!approval, width)}>
      {showUser && (
        <div className={UserAvatarWrapperStyle}>
          <UserAvatar firstName={parsedUser.firstName} lastName={parsedUser.lastName} />
          {editable && (
            <button
              className={DeactivateButtonStyle}
              onClick={evt => {
                evt.stopPropagation();
                onClickUser();
              }}
              type="button"
            >
              <Icon icon="CLEAR" />
            </button>
          )}
        </div>
      )}

      <div className={StatusLabelWrapperStyle}>
        <div className={StatusLabelStyle}>
          {approval ? (
            <FormattedMessage id="components.inputs.approved" defaultMessage="APPROVED" />
          ) : (
            <FormattedMessage id="components.inputs.rejected" defaultMessage="REJECTED" />
          )}
        </div>

        {showDate && (
          <div className={StatusLabelStyle}>
            <FormattedDate value={parsedDate} />
          </div>
        )}
      </div>

      <Icon icon={approval ? 'CHECKED' : 'CANCEL'} />
    </div>
  );
};

TaskApprovalStatusInput.defaultProps = defaultProps;

export default TaskApprovalStatusInput;

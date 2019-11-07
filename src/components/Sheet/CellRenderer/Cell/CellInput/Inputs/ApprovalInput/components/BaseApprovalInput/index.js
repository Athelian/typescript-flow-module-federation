// @flow
import * as React from 'react';
import type { User } from 'generated/graphql';
import { useAuthorizedViewer } from 'contexts/Viewer';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import { ApproveButton } from 'components/Buttons';
import {
  ApprovalWrapperStyle,
  ApprovedDateStyle,
  ApproveButtonStyle,
  DisapproveButtonStyle,
  HoverDisapproveButtonStyle,
} from './style';

type Props = {|
  approved: ?{ user: ?User, date: ?(string | Date) },
  onApprove: User => void,
  onDisapprove: () => void,
  readonly: boolean,
|};

const BaseApprovalInput = ({ approved, onApprove, onDisapprove, readonly }: Props) => {
  const { user } = useAuthorizedViewer();

  return (
    <div className={ApprovalWrapperStyle}>
      {readonly ? (
        <>
          <div className={ApprovedDateStyle}>
            <FormattedDate value={approved?.date} />
          </div>
          <UserAvatar
            width="20px"
            height="20px"
            firstName={approved?.user?.firstName}
            lastName={approved?.user?.lastName}
          />
        </>
      ) : (
        <>
          {approved?.date && approved?.user ? (
            <>
              <div className={ApprovedDateStyle}>
                <FormattedDate value={approved?.date} />
              </div>
              <button className={DisapproveButtonStyle} onClick={onDisapprove} type="button">
                <UserAvatar
                  width="20px"
                  height="20px"
                  firstName={approved?.user?.firstName}
                  lastName={approved?.user?.lastName}
                />
                <div className={HoverDisapproveButtonStyle}>
                  <Icon icon="CLEAR" />
                </div>
              </button>
            </>
          ) : (
            <ApproveButton onClick={() => onApprove(user)} className={ApproveButtonStyle} />
          )}
        </>
      )}
    </div>
  );
};

export default BaseApprovalInput;

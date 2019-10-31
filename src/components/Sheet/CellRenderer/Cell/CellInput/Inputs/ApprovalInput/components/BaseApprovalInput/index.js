// @flow
import * as React from 'react';
import type { User } from 'generated/graphql';
import { useAuthorizedViewer } from 'contexts/Viewer';
import Icon from 'components/Icon';

import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import { ApproveButton } from 'components/Buttons';
import { ApprovalWrapperStyle, ApprovedAtStyle, UnapproveButtonStyle } from './style';

type Props = {|
  approvedAt: ?(string | Date),
  approvedBy: ?User,
  onApprove: Object => void,
  onUnapprove: () => void,
  editable: boolean,
  inputRef: React.Ref<any>,
|};

const BaseApprovalInput = ({
  approvedAt,
  approvedBy,
  onApprove,
  onUnapprove,
  editable,
  inputRef,
}: Props) => {
  const { user } = useAuthorizedViewer();
  if (!editable) {
    return (
      <div className={ApprovalWrapperStyle}>
        <div className={ApprovedAtStyle}>
          <FormattedDate value={approvedAt} />
        </div>
        <UserAvatar
          ref={inputRef}
          firstName={approvedBy?.firstName}
          lastName={approvedBy?.lastName}
        />
      </div>
    );
  }
  return (
    <div className={ApprovalWrapperStyle}>
      {approvedBy && (
        <>
          <div className={ApprovedAtStyle}>
            <FormattedDate value={approvedAt} />
          </div>
          <button
            className={UnapproveButtonStyle}
            onClick={onUnapprove}
            type="button"
            ref={inputRef}
          >
            <Icon icon="CLEAR" />
          </button>
        </>
      )}
      {!approvedBy && <ApproveButton buttonRef={inputRef} onClick={() => onApprove(user)} />}
    </div>
  );
};

export default BaseApprovalInput;

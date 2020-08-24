// @flow
import * as React from 'react';
import type { User } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import useUser from 'hooks/useUser';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDateTZ from 'components/FormattedDateTZ';
import { ApproveButton } from 'components/Buttons';
import { newDateUTC } from 'utils/date';
import {
  ApprovalWrapperStyle,
  ApprovedDateStyle,
  ApproveButtonStyle,
  DisapproveButtonStyle,
  HoverDisapproveButtonStyle,
} from './style';

const ApprovalInputTZ = ({
  value,
  readonly,
  onChange,
}: InputProps<{ user: ?User, date: ?string }>) => {
  const { user } = useUser();

  return (
    <div className={CellInputWrapperStyle}>
      <div className={ApprovalWrapperStyle}>
        {readonly ? (
          <>
            <div className={ApprovedDateStyle}>
              <FormattedDateTZ value={value?.date} user={user} />
            </div>
            <UserAvatar
              width="20px"
              height="20px"
              firstName={value?.user?.firstName}
              lastName={value?.user?.lastName}
            />
          </>
        ) : (
          <>
            {value?.date && value?.user ? (
              <>
                <div className={ApprovedDateStyle}>
                  <FormattedDateTZ value={value?.date} user={user} />
                </div>
                <button
                  className={DisapproveButtonStyle}
                  onClick={() => onChange({ user: null, date: null }, true)}
                  type="button"
                >
                  <UserAvatar
                    width="20px"
                    height="20px"
                    firstName={value?.user?.firstName}
                    lastName={value?.user?.lastName}
                  />
                  <div className={HoverDisapproveButtonStyle}>
                    <Icon icon="CLEAR" />
                  </div>
                </button>
              </>
            ) : (
              <ApproveButton
                onClick={() => onChange({ user, date: newDateUTC() }, true)}
                className={ApproveButtonStyle}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApprovalInputTZ;

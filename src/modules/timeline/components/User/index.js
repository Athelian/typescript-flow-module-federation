// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedName from 'components/FormattedName';
import { Tooltip } from 'components/Tooltip';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import type { UserInfo } from 'modules/timeline/types';
import {
  AvatarWrapperStyle,
  ContentWrapperStyle,
  EmailStyle,
  GroupStyle,
  InfoWrapperStyle,
  MainNameStyle,
  NameStyle,
  RolesStyle,
  UserWrapperStyle,
} from './style';

type Props = {
  user: UserInfo,
};

const User = ({ user }: Props) => {
  let userRoleIcon = 'USER';

  if (user?.roles?.some(role => role.name === 'admin')) {
    userRoleIcon = 'MANAGER';
  }

  if (!user.firstName || !user.lastName) {
    return (
      <span>
        <FormattedMessage id="components.cards.deletedUser" defaultMessage="[ Deleted ]" />
      </span>
    );
  }

  return (
    <Tooltip
      className={UserWrapperStyle}
      message={
        <div className={ContentWrapperStyle}>
          <div className={AvatarWrapperStyle}>
            <UserAvatar
              width="40px"
              height="40px"
              image={user.avatar ? user.avatar.path : null}
              hideTooltip
            />
          </div>
          <div className={InfoWrapperStyle}>
            <span className={NameStyle}>
              <FormattedName firstName={user.firstName} lastName={user.lastName} />
            </span>
            <span className={GroupStyle}>{user?.organization?.name || ''}</span>
            <span className={EmailStyle}>{user?.email || ''}</span>
            <div className={RolesStyle}>
              <Icon icon={userRoleIcon} />
              {userRoleIcon === 'MANAGER' ? (
                <FormattedMessage id="components.cards.managerUser" defaultMessage="Manager" />
              ) : (
                <FormattedMessage id="components.cards.defaultUser" defaultMessage="User" />
              )}
            </div>
          </div>
        </div>
      }
    >
      <span className={MainNameStyle}>
        <FormattedName firstName={user.firstName} lastName={user.lastName} />
      </span>
    </Tooltip>
  );
};

export default User;

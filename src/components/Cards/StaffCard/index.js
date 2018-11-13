// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { type User as Staff } from 'modules/staff/type.js.flow';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import FormattedName from 'components/FormattedName';
import UserAvatar from 'components/UserAvatar';
import BaseCard from '../BaseCard';
import {
  StaffCardWrapperStyle,
  StaffNameStyle,
  StaffEmailStyle,
  StaffRoleStyle,
  StaffTagsWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: Function,
};

type Props = OptionalProps & {
  staff: ?Staff,
};

const defaultProps = {
  onClick: () => {},
};

const StaffCard = ({ staff, onClick, ...rest }: Props) => {
  if (!staff) return '';

  const { firstName, lastName, role, email, tags } = staff;

  const actions = [];

  let userRoleIcon = 'USER';
  if (role === 'manager') {
    userRoleIcon = 'MANAGER';
  }

  return (
    <BaseCard icon="STAFF" color="STAFF" actions={actions} {...rest}>
      <div className={StaffCardWrapperStyle} onClick={onClick} role="presentation">
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          width="105px"
          height="105px"
          showBothInitials
          hideTooltip
        />
        <div className={StaffNameStyle}>
          <FormattedName firstName={firstName} lastName={lastName} />
        </div>
        <div className={StaffEmailStyle}>{email}</div>
        <div className={StaffRoleStyle}>
          <Icon icon={userRoleIcon} />
          {role === 'manager' ? (
            <FormattedMessage id="components.cards.managerUser" defaultMessage="Manager" />
          ) : (
            <FormattedMessage id="components.cards.defaultUser" defaultMessage="User" />
          )}
        </div>
        <div className={StaffTagsWrapperStyle}>
          {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
        </div>
      </div>
    </BaseCard>
  );
};

StaffCard.defaultProps = defaultProps;

export default StaffCard;

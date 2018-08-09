// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import type { User } from 'modules/staff/type.js.flow';
import Card from 'components/EntityCard';
import Icon from 'components/Icon';
import FormattedName from 'components/FormattedName';
import messages from 'modules/staff/messages';
import {
  NameStyle,
  EmailStyle,
  SubFieldStyle,
  IconStyle,
  TagsWrapperStyle,
  TagStyle,
} from './style';

type Props = {
  user: User,
  intl: intlShape,
};

function UserItem({ user, intl }: Props) {
  if (!user) return null;
  const { email, role, firstName, lastName, tags } = user;
  return (
    <Card
      icon="faUsers"
      color="GRAY_LIGHT"
      onClick={() => {
        // history.push(`/staff/${id}`);
      }}
      title={intl.formatMessage(messages.tooltipDetails)}
    >
      <div
        className={NameStyle}
        title={intl.formatMessage(messages.tooltipName, { firstName, lastName })}
      >
        <b>
          <FormattedName firstName={firstName} lastName={lastName} />
        </b>
      </div>
      <div className={EmailStyle} title={intl.formatMessage(messages.tooltipEmail, { email })}>
        {email}
      </div>
      <div className={SubFieldStyle} title={intl.formatMessage(messages.tooltipRole, { role })}>
        <div className={IconStyle}>
          <Icon icon="faIdBadge" />
        </div>

        <b>{role}</b>
      </div>
      <div className={TagsWrapperStyle}>
        {tags.map(tag => (
          <div className={TagStyle(tag.color)} key={tag.id}>
            {tag.name}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default injectIntl(UserItem);

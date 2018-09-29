// @flow
import * as React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import UserAvatar from 'components/UserAvatar';
import { Label, Display } from 'components/Form';
import { LastModifiedWrapperStyle, LastModifiedStyle, UserIconStyle } from './style';

const messages = defineMessages({
  updatedAt: {
    id: 'components.Form.updatedAt',
    defaultMessage: 'LAST MODIFIED',
  },
});

type OptionalProps = {
  updatedBy: ?{
    firstName: string,
    lastName: string,
  },
};

type Props = OptionalProps & {
  updatedAt: string,
};

const defaultProps = {
  updatedBy: {
    firstName: '',
    lastName: '',
  },
};

function SectionHeader({ updatedAt, updatedBy }: Props) {
  const { firstName, lastName } = updatedBy || {
    firstName: '',
    lastName: '',
  };
  return (
    <div className={LastModifiedWrapperStyle}>
      <div className={LastModifiedStyle}>
        <Label width="100%" align="right">
          <FormattedMessage {...messages.updatedAt} />
        </Label>
        <Display>
          <FormattedDate value={updatedAt} />
        </Display>
      </div>
      <div className={UserIconStyle}>
        <UserAvatar firstName={firstName} lastName={lastName} width="20px" height="20px" />
      </div>
    </div>
  );
}

SectionHeader.defaultProps = defaultProps;

export default SectionHeader;

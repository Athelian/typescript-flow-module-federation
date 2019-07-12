// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import UserAvatar from 'components/UserAvatar';
import { Label, Display } from 'components/Form';
import { LastModifiedWrapperStyle, LastModifiedStyle, UserIconStyle } from './style';

type OptionalProps = {
  updatedBy: ?{
    firstName: string,
    lastName: string,
  },
};

type Props = OptionalProps & {
  updatedAt: string,
};

function SectionHeader({ updatedAt, updatedBy }: Props) {
  return (
    <div className={LastModifiedWrapperStyle}>
      <div className={LastModifiedStyle}>
        <Label width="100%" align="right">
          <FormattedMessage id="components.form.updatedAt" defaultMessage="Last Modified" />
        </Label>
        <Display>
          <FormattedDate value={updatedAt} />
        </Display>
      </div>
      <div className={UserIconStyle}>
        <UserAvatar
          firstName={updatedBy ? updatedBy.firstName : ''}
          lastName={updatedBy ? updatedBy.lastName : ''}
          width="20px"
          height="20px"
        />
      </div>
    </div>
  );
}

export default SectionHeader;

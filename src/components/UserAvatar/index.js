// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import { AvatarWrapperStyle } from './style';

type OptionalProps = {
  width: string,
  height: string,
  firstName: string,
  lastName: string,
  image: ?string,
  showBothInitials: boolean,
  hideTooltip: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  width: '30px',
  height: '30px',
  firstName: '',
  lastName: '',
  image: null,
  showBothInitials: false,
  hideTooltip: false,
};

function UserAvatar({
  width,
  height,
  image,
  firstName,
  lastName,
  showBothInitials,
  hideTooltip,
}: Props) {
  let content = '';

  if (image) {
    content = (
      <div className={AvatarWrapperStyle({ width, height })}>
        <img alt="user_avatar" src={image} width={width} height={height} />
      </div>
    );
  } else if (firstName === '' || lastName === '') {
    content = (
      <div className={AvatarWrapperStyle({ width, height })}>
        <Icon icon="USER" />
      </div>
    );
  } else
    content = (
      <div className={AvatarWrapperStyle({ width, height })}>
        <FormattedName
          firstName={firstName.charAt(0)}
          lastName={lastName.charAt(0)}
          showOnlyOneName={!showBothInitials}
        />
      </div>
    );

  if (hideTooltip) {
    return content;
  }

  return (
    <Tooltip message={<FormattedName firstName={firstName} lastName={lastName} />}>
      {content}
    </Tooltip>
  );
}

UserAvatar.defaultProps = defaultProps;

export default UserAvatar;

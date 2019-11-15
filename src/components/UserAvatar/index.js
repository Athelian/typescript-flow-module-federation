// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { AvatarWrapperStyle } from './style';

type Props = {|
  width: string,
  height: string,
  firstName: string,
  lastName: string,
  image: ?string,
  showBothInitials: boolean,
  hideTooltip: boolean,
|};

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
  ...rest
}: Props) {
  let content = '';

  if (image) {
    content = <img alt="user_avatar" src={image} width={width} height={height} />;
  } else if (firstName === '' || lastName === '') {
    content = <Icon icon="USER" />;
  } else
    content = (
      <FormattedName
        firstName={firstName.charAt(0)}
        lastName={lastName.charAt(0)}
        showOnlyOneName={!showBothInitials}
      />
    );

  if (hideTooltip) {
    return <div className={AvatarWrapperStyle({ width, height })}>{content}</div>;
  }

  return (
    <Tooltip message={<FormattedName firstName={firstName} lastName={lastName} {...rest} />}>
      <div className={AvatarWrapperStyle({ width, height })} tabIndex="-1">
        {content}
      </div>
    </Tooltip>
  );
}

UserAvatar.defaultProps = defaultProps;

export default UserAvatar;

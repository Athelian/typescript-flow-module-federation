// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import { AvatarWrapperStyle } from './style';

type OptionalProps = {
  width: string,
  height: string,
  firstName: string,
  lastName: string,
  image: ?string,
  showBothInitials: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  width: '30px',
  height: '30px',
  firstName: '',
  lastName: '',
  image: null,
  showBothInitials: false,
};

function UserAvatar({ width, height, image, firstName, lastName, showBothInitials }: Props) {
  if (image) {
    return (
      <div className={AvatarWrapperStyle({ width, height })}>
        <img alt="user_avatar" src={image} width={width} height={height} />
      </div>
    );
  }

  return (
    <div className={AvatarWrapperStyle({ width, height })}>
      <FormattedName
        firstName={firstName.charAt(0)}
        lastName={lastName.charAt(0)}
        showOnlyOneName={!showBothInitials}
      />
    </div>
  );
}

UserAvatar.defaultProps = defaultProps;

export default UserAvatar;

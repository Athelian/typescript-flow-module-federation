// @flow
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faUser from '@fortawesome/fontawesome-pro-solid/faUser';
import { WrapperStyle } from './style';

type Props = {
  profileUrl: string,
  width?: number,
  height?: number,
  alt?: string,
};

function UserAvatar({ profileUrl, width, height, alt }: Props) {
  return (
    <div className={WrapperStyle}>
      {profileUrl ? (
        <img alt={alt} src={profileUrl} width={width} height={height} />
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
    </div>
  );
}

UserAvatar.defaultProps = {
  width: 50,
  height: 50,
  alt: 'avatar',
};

export default UserAvatar;

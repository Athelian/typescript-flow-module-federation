// @flow
import * as React from 'react';
import { AvatarWrapperStyle } from './style';

type Props = {
  profileUrl: string,
  width?: number,
  height?: number,
  alt?: string,
};

const DummyUser = {
  initial: 'Z',
};

function UserAvatar({ profileUrl, width, height, alt }: Props) {
  return (
    <div className={AvatarWrapperStyle}>
      {profileUrl ? (
        <img alt={alt} src={profileUrl} width={width} height={height} />
      ) : (
        DummyUser.initial
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

// @flow
import * as React from 'react';
import { AvatarWrapperStyle } from './style';

type OptionalProps = {
  width: number,
  height: number,
  alt: string,
};

type Props = OptionalProps & {
  profileUrl: string,
};

const defaultProps = {
  width: 50,
  height: 50,
  alt: 'avatar',
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

UserAvatar.defaultProps = defaultProps;

export default UserAvatar;

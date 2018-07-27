// @flow
import { css } from 'react-emotion';

export const NavBarStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  background: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
`;

export const ChildrenWrapperStyle = css`
  flex: 1;
`;

export const MandatoryStyle = css`
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
`;

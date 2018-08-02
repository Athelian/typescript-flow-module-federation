// @flow
import { css } from 'react-emotion';

export const NavBarStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  background: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
`;

export const ChildrenStyle = css`
  flex: 1;
  display: flex;
  align-items: center;
  & > div {
    margin-right: 10px;
  }
`;

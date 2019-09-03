// @flow
import { css } from 'react-emotion';

export const WrapperStyle = css`
  width: 465px;
  height: 55px;
  position: relative;
  > :last-child {
    opacity: 0;
  }
  &:hover > :last-child {
    opacity: 1;
  }
`;

export const BatchIconsStyle = css`
  position: absolute;
  right: -10px;
  bottom: -10px;
  background: #12b937;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  width: 40px;
  height: 20px;
  color: #fff;
  &:hover {
    cursor: pointer;
  }
`;

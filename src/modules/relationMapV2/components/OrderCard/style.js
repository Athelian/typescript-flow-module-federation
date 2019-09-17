// @flow
import { css } from 'react-emotion';

export const WrapperStyle = css`
  width: 285px;
  height: 55px;
  position: relative;
  > :last-child {
    opacity: 0;
  }
  &:hover > :last-child {
    opacity: 1;
  }
`;

export const ItemIconsStyle = css`
  position: absolute;
  right: -10px;
  bottom: -10px;
  background: #fbaa1d;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  font-size: 12px;
  line-height: 12px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  width: 40px;
  height: 20px;
  color: #fff;
  &:hover {
    cursor: pointer;
  }
`;

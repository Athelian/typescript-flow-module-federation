// @flow
import { css } from 'react-emotion';

export const WrapperStyle = css`
  width: 445px;
  height: 55px;
  position: relative;
  > .icons {
    opacity: 0;
  }
  &:hover > .icons {
    opacity: 1;
  }
`;

export const TrashIconsStyle = css`
  position: absolute;
  right: -10px;
  top: -10px;
  z-index: 2;
  background: #ffffff;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  font-size: 12px;
  line-height: 12px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  text-transform: uppercase;
  color: #cccccc;
  &:hover {
    cursor: pointer;
  }
`;

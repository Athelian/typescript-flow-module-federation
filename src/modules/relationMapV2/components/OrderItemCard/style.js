// @flow
import { css } from 'react-emotion';

export const WrapperStyle = css`
  width: 465px;
  height: 55px;
  position: relative;
  > .icons {
    opacity: 0;
  }
  &:hover > .icons {
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
  font-size: 12px;
  line-height: 12px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  &:hover {
    cursor: pointer;
  }
`;

export const TrashIconsStyle = css`
  position: absolute;
  right: -5px;
  top: -5px;
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

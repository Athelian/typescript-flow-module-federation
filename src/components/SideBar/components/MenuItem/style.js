// @flow
import { css } from 'react-emotion';
import { transitions, fontSizes } from 'styles/common';

export const MenuItemStyle = (isActive: boolean): string => css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  text-transform: uppercase;
  color: #fff;
  width: 100%;
  height: 50px;
  ${fontSizes.MAIN};
  letter-spacing: 2px;
  cursor: pointer;
  & > span {
    min-width: 5px;
    height: ${isActive ? '100%' : '0px'};
    background-color: #fff;
    ${transitions.MAIN};
  }
  &:hover {
    & > span {
      height: 100%;
    }
  }
  &:focus {
    outline: none;
  }
`;

export const IconStyle: string = css`
  display: flex;
  width: 40px;
  height: 50px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0 5px 0 0;
  & > .fa-angle-right {
    margin: 0 10px 0 auto;
    ${transitions.MAIN};
    &.active {
      transform: rotate(90deg);
    }
  }
`;

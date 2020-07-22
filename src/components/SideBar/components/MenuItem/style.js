// @flow
import { css } from 'react-emotion';
import { transitions, fontSizes, colors, borderRadiuses } from 'styles/common';

export const MenuItemStyle = (isActive: boolean): string => css`
  position: relative;
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
  ${transitions.MAIN};
  & > .fa-angle-right {
    margin: 0 10px 0 auto;
    ${transitions.MAIN};
    &.active {
      transform: rotate(90deg);
    }
  }
`;

export const BetaStyle: string = css`
  position: absolute;
  top: 0px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  ${borderRadiuses.BUTTON};
  padding: 0 2px 0 4px;
  letter-spacing: 2px;
  opacity: 0.75;
`;

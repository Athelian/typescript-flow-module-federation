// @flow
import { css } from 'react-emotion';
import { transitions, fontSizes } from 'styles/common';

export const SubMenuStyle = css`
  overflow: hidden;
  min-height: min-content;
`;

export const SubMenuItemStyle = (isExpanded: boolean) => css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  color: #fff;
  width: 100%;
  height: 50px;
  ${fontSizes.MAIN};
  letter-spacing: 1px;
  cursor: pointer;
  ${transitions.MAIN};
  box-shadow: ${isExpanded ? '0 3px 5px rgba(0, 0, 0, 0.1)' : 'none'};
  &:focus {
    outline: none;
  }
  & > span {
    min-width: 5px;
    height: ${isExpanded ? '50px' : '0px'};
    background-color: rgba(255, 255, 255, 0.5);
    ${transitions.MAIN};
  }
  &:hover {
    & > span {
      height: 50px;
    }
  }
  & > .icon {
    display: flex;
    width: 40px;
    height: 50px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin: 0 5px 0 0;
  }
  & > .fa-angle-right {
    margin: 0 10px 0 auto;
    ${transitions.MAIN};
    &.active {
      transform: rotate(90deg);
    }
  }
`;

export const SubMenuBodyStyle = (isExpanded: boolean, menuItemCount: number) => css`
  height: ${isExpanded ? `${menuItemCount * 50}px` : '0px'};
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
  ${transitions.EXPAND};
`;

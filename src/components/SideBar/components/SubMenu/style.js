// @flow
import { css } from 'react-emotion';
import { transitions, fontSizes, colors, presets, borderRadiuses } from 'styles/common';

export const SubMenuWrapperStyle: string = css`
  overflow: hidden;
  min-height: min-content;
`;

export const SubMenuItemWrapperStyle = (
  isExpanded: boolean,
  hasActiveChild: boolean
): string => css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  color: ${colors.WHITE};
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
    height: ${hasActiveChild ? '50px' : '0px'};
    background-color: rgba(255, 255, 255, 0.5);
    ${transitions.MAIN};
  }
  &:hover {
    & > span {
      height: 50px;
    }
  }
`;

export const SubMenuItemStyle: string = css`
  display: flex;
  flex: 1;
  align-items: center;
`;

export const ChevronButtonStyle = (isExpanded: boolean, hasActiveChild: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  ${isExpanded && 'transform: rotate(180deg)'};
  margin: 5px;
  ${hasActiveChild && `opacity: 0.25`};
  ${!hasActiveChild &&
    `
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `};
`;

export const SubMenuBodyStyle = (isExpanded: boolean, menuItemCount: number): string => css`
  height: ${isExpanded ? `${menuItemCount * 50}px` : '0px'};
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
  ${transitions.EXPAND};
  box-shadow: 5px 0 0 0 rgba(0, 0, 0, 0.2) inset;
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

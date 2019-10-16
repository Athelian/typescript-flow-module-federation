// @flow
import { css } from 'react-emotion';
import { borderRadiuses, fontSizes, colors, presets, shadows, transitions } from 'styles/common';

export const CardActionsWrapperStyle: string = css`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 2;
`;

export const CardActionsButtonStyle = (dropdownIsOpen: boolean): string => css`
  opacity: ${dropdownIsOpen ? 1 : 0};
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background-color: ${colors.WHITE};
  color: ${dropdownIsOpen ? colors.TEAL : colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  ${borderRadiuses.CIRCLE};
  ${shadows.INPUT};
  &:hover {
    color: ${colors.TEAL};
  }
`;

export const DropdownWrapperStyle = (dropdownIsOpen: boolean, numOfOptions: number): string => css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  z-index: 2;
  ${shadows.INPUT};
  width: min-content;
  background: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  cursor: pointer;
  height: ${dropdownIsOpen ? `${numOfOptions * 30}px` : '0px'};
  ${transitions.EXPAND};
`;

export const OptionStyle: string = css`
  ${presets.BUTTON};
  justify-content: flex-start;
  line-height: 20px;
  padding: 5px;
  ${presets.ELLIPSIS};
  flex-shrink: 0;
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  background-color: ${colors.WHITE};
  height: 30px;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

// @flow
import { css } from 'react-emotion';
import { borderRadiuses, fontSizes, colors, presets, shadows } from 'styles/common';

export const CardActionsWrapperStyle: string = css`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 4;
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

export const DropdownWrapperStyle = (numOfOptions: number): string => css`
  display: flex;
  flex-direction: column;
  position: absolute;
  margin: 0;
  padding: 0;
  overflow: hidden;
  ${shadows.INPUT};
  width: min-content;
  background: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  cursor: pointer;
  height: ${numOfOptions * 30}px;
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

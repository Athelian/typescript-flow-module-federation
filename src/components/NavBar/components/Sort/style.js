// @flow
import { css } from 'react-emotion';
import {
  layout,
  colors,
  borderRadiuses,
  fontSizes,
  transitions,
  presets,
  shadows,
  scrollbars,
} from 'styles/common';

export const WrapperStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.MAIN};
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 30px;
  align-items: center;
  border: 1px solid ${isOpen ? colors.TEAL : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${colors.WHITE};
  ${isOpen ? shadows.INPUT : ''};
  &:hover {
    ${shadows.INPUT};
  }
  ${transitions.MAIN};
  ${fontSizes.MAIN};
`;

export const InputStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  flex: 1;
  height: 20px;
  border: none;
  outline: none;
  border-right: 1px solid ${colors.GRAY_VERY_LIGHT};
  color: ${colors.BLACK};
  padding: 0 4px;
  ${presets.ELLIPSIS};
  cursor: pointer;
`;

export const ButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  ${borderRadiuses.MAIN};
  color: ${colors.GRAY_LIGHT};
  &:hover,
  &:focus {
    color: ${colors.TEAL};
  }
`;

export const OptionWrapperStyle: string = css`
  ${presets.BOX};
  ${shadows.DROPDOWN};
  ${borderRadiuses.MAIN};
  position: absolute;
  top: calc(100% + 5px);
  max-height: 150px;
  width: 150px;
  ${scrollbars.SMALL};
  overflow-x: hidden;
  overflow-y: overlay;
`;

export const OptionItemStyle = (onHover: boolean, selected: boolean): string => css`
  background: ${onHover ? colors.GRAY_SUPER_LIGHT : colors.TRANSPARENT};
  ${presets.BUTTON};
  justify-content: flex-start;
  padding: 0 5px;
  color: ${selected ? colors.TEAL : colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  flex: 1;
  height: 30px;
  width: 150px;
  ${presets.ELLIPSIS};
  text-transform: capitalize;
`;

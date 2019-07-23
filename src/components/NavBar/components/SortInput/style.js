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

export const WrapperStyle = (borderRound: boolean) => css`
  ${presets.BUTTON};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRound && borderRadiuses.MAIN};
  position: relative;
  background: #fff;
  overflow: hidden;
  width: 150px;
  height: 30px;
  align-items: center;
  padding: 0 0 0 5px;
  ${transitions.MAIN};
  ${shadows.NAV_BUTTON};
  ${fontSizes.MAIN};
`;

export const InputStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  flex: 1;
  height: 20px;
  border: none;
  outline: none;
  border-right: 1px solid ${colors.GRAY_VERY_LIGHT};
  padding: 0 5px 0 0;
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  cursor: pointer;
`;

export const ButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
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

// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, presets, shadows, layout } from 'styles/common';
import { computeTextColor } from 'utils/color';

export const WrapperStyle: string = css`
  position: relative;
`;

export const ColorPreviewStyle = (
  color: string,
  disabled: boolean,
  readOnly: boolean
): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  color: ${computeTextColor(color)};
  background-color: ${color};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    ${!readOnly && !disabled && `${shadows.INPUT}`};
  }
`;

export const DropdownWrapper: string = css`
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  position: absolute;
  margin-top: 5px;
  z-index: 1;
`;

export const RandomizeButtonStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.GRAY_LIGHT};
  ${borderRadiuses.CIRCLE};
  height: 20px;
  width: 20px;
  ${fontSizes.SMALL};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  &:hover {
    background-color: ${colors.GRAY_VERY_LIGHT};
    color: ${colors.BLUE};
  }
`;

export const ColorPresetsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 10px;
`;

export const PresetStyle = (color: string): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${color};
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  &:hover {
    opacity: 0.8;
  }
`;

// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, presets, shadows } from 'styles/common';
import { computeTextColor } from 'utils/color';

export const WrapperStyle: string = css`
  position: relative;
`;

export const ColorPreviewStyle = (color: string): string => css`
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
    ${shadows.INPUT};
  }
`;

export const DropdownWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  position: absolute;
  margin-top: 5px;
  z-index: 1;
  padding: 10px;
`;

export const ColorPickerWrapperStyle: string = css`
  position: relative;
  width: 200px;
  height: 100px;
  margin: 0 0 10px 0;
`;

export const ColorPresetsWrapperStyle: string = css`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(7, 20px);
  grid-template-rows: repeat(3, 20px);
  grid-column-gap: 10px;
  grid-row-gap: 5px;
  padding: 0 0 10px 0;
`;

export const PresetStyle = (color: string): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${color};
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  ${color === '#FFFFFF' && `border: 1px solid ${colors.GRAY_LIGHT}`};
  &:hover {
    opacity: 0.8;
  }
`;

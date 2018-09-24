// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, presets, transitions } from 'styles/common';

export const WrapperStyle: string = css`
  position: relative;
`;

export const ColorPreviewStyle = (
  color: string,
  disabled: boolean,
  readOnly: boolean
): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${color};
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  &:hover {
    ${!readOnly && !disabled && `opacity: 0.8`};
  }
`;

export const DropdownWrapper: string = css`
  ${presets.BOX};
  position: absolute;
  margin-top: 5px;
  z-index: 5;
`;

export const ColorControlWrapperStyle: string = css`
  display: inline-grid;
  grid-template-columns: min-content 1fr;
  padding: 10px;
  align-items: center;
`;

export const ColorPresetsWrapperStyle: string = css`
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: repeat(5, auto);
  grid-gap: 10px;
  padding: 10px;
`;

export const RandomizeButtonStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.GRAY_LIGHT};
  ${borderRadiuses.CIRCLE};
  height: 30px;
  width: 30px;
  ${fontSizes.MAIN};
  &:hover {
    background-color: ${colors.GRAY_SUPER_LIGHT};
    color: ${colors.TEAL};
  }
`;

export const InputStyle = (hasError: boolean): string => css`
  ${transitions.MAIN};
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  border-radius: 2px;
  border: none;
  border-bottom: 2px solid ${hasError ? colors.RED : colors.GRAY_VERY_LIGHT};
  font-weight: bold;
  padding: 10px;
  background: #fff;
  height: 40px;
  &:focus {
    border-color: ${hasError ? colors.RED : colors.TEAL};
    outline: none;
  }
`;

export const PresetStyle = (color: string): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${color};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  &:hover {
    opacity: 0.8;
  }
`;

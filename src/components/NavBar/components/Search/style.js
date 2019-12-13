// @flow
import { css } from 'react-emotion';
import {
  layout,
  borderRadiuses,
  transitions,
  shadows,
  fontSizes,
  colors,
  presets,
} from 'styles/common';

export const SearchStyle = (focused: boolean): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.BUTTON};
  ${transitions.MAIN};
  border: 1px solid ${focused ? colors.TEAL : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${colors.WHITE};
  width: 200px;
  height: 30px;
  box-sizing: content-box;
  &:hover {
    ${shadows.INPUT};
  }
`;

export const InputStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  flex: 1 0 auto;
  height: 20px;
  padding: 0 4px 0 8px;
  background: none;
  border: none;
  font-weight: bold;
  outline: none;
  &::placeholder {
    color: ${colors.GRAY_LIGHT};
  }
`;

export const SeparatorStyle: string = css`
  background: ${colors.GRAY_VERY_LIGHT};
  width: 1px;
  height: 20px;
  border: none;
`;

export const SearchButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  &:hover,
  &:focus {
    color: ${colors.TEAL};
  }
`;

export const ClearButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;

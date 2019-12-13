// @flow
import { css } from 'react-emotion';
import { borderRadiuses, transitions, shadows, fontSizes, colors, presets } from 'styles/common';

export const SearchStyle = (focused: boolean): string => css`
  display: flex;
  align-items: center;
  ${borderRadiuses.BUTTON};
  ${transitions.MAIN};
  border: 1px solid ${focused ? colors.TEAL : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${colors.WHITE};
  width: 200px;
  height: 30px;
  ${focused && shadows.INPUT};
  &:hover {
    ${shadows.INPUT};
  }
`;

export const InputStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  flex: 1;
  width: 100%;
  height: 28px;
  padding: 0 0 0 9px;
  background: none;
  border: none;
  font-weight: bold;
  outline: none;
  &::placeholder {
    color: ${colors.GRAY_LIGHT};
  }
`;

export const SearchButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 28px;
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
  height: 28px;
  width: 20px;
  flex-shrink: 0;
  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;

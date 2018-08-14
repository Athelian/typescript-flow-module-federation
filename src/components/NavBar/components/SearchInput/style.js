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
} from 'styles/common';

export const SearchInputStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  position: relative;
  overflow: hidden;
  background: #fff;
  ${borderRadiuses.BUTTON};
  width: 200px;
  height: 30px;
  ${transitions.MAIN};
  flex-shrink: 0;
  ${shadows.NAV_BUTTON};
`;

export const SearchIconStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const InputStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  background: none;
  border: none;
  font-weight: bold;
  width: 100%;
  outline: none;
  height: 30px;
`;

export const ClearButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;
